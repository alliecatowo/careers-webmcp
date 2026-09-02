'use client';
/**
 * Canonical application draft state, shared by the human application form and
 * the WebMCP application tools. See ./index.ts for the frozen public
 * signatures this module implements.
 */
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { CandidateSession } from '@/domain/session/session.store';
import {
  ApplicationError,
  type ApplicationDraft,
  type ApplicationFields,
  type ApplicationJobRef,
} from './index';
import { validateApplicationField, validateApplicationFields } from './validation';

export const APPLICATIONS_STORAGE_KEY = 'careers.applications.v1';

interface ApplicationsState {
  applications: Record<string, ApplicationDraft>;
  nextId: number;
}

/** In-memory fallback so this store is importable under vitest's `node` environment. */
function createMemoryStorage(): StateStorage {
  const memory = new Map<string, string>();
  return {
    getItem: (name) => memory.get(name) ?? null,
    setItem: (name, value) => {
      memory.set(name, value);
    },
    removeItem: (name) => {
      memory.delete(name);
    },
  };
}

const storageImpl: StateStorage =
  typeof localStorage === 'undefined' ? createMemoryStorage() : (localStorage as unknown as StateStorage);

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    () => ({
      applications: {},
      nextId: 1,
    }),
    {
      name: APPLICATIONS_STORAGE_KEY,
      storage: createJSONStorage(() => storageImpl),
    },
  ),
);

function prefillFields(candidate: CandidateSession): ApplicationFields {
  const profile = candidate.profile;
  return {
    fullName: profile.fullName ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    location: profile.location ?? '',
    linkedinUrl: profile.linkedinUrl ?? '',
    portfolioUrl: profile.portfolioUrl ?? '',
    yearsExperience: profile.yearsExperience ?? null,
    coverNote: '',
    availability: '',
  };
}

export function listApplications(candidateId: string): ApplicationDraft[] {
  return Object.values(useApplicationsStore.getState().applications)
    .filter((draft) => draft.candidateId === candidateId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Only ever returns the candidate's own application. */
export function getApplication(candidateId: string, applicationId: string): ApplicationDraft | null {
  const draft = useApplicationsStore.getState().applications[applicationId];
  if (!draft || draft.candidateId !== candidateId) return null;
  return draft;
}

export function findApplicationByJob(candidateId: string, jobId: string): ApplicationDraft | null {
  return (
    Object.values(useApplicationsStore.getState().applications).find(
      (draft) => draft.candidateId === candidateId && draft.jobId === jobId,
    ) ?? null
  );
}

/** Same as startApplication, but also reports whether a new draft was created. */
export function startApplicationDetailed(
  candidate: CandidateSession,
  job: ApplicationJobRef,
): { draft: ApplicationDraft; created: boolean } {
  const existing = findApplicationByJob(candidate.id, job.id);
  if (existing) {
    return { draft: existing, created: false };
  }

  const state = useApplicationsStore.getState();
  const id = `app_${state.nextId}`;
  const now = new Date().toISOString();
  const draft: ApplicationDraft = {
    id,
    candidateId: candidate.id,
    jobId: job.id,
    jobTitle: job.title,
    countrySlug: job.countrySlug,
    status: 'draft',
    revision: 1,
    fields: prefillFields(candidate),
    createdAt: now,
    updatedAt: now,
    submittedAt: null,
  };

  useApplicationsStore.setState({
    applications: { ...state.applications, [id]: draft },
    nextId: state.nextId + 1,
  });

  return { draft, created: true };
}

/** Idempotent: returns the existing draft/submitted application for that job instead of duplicating. */
export function startApplication(candidate: CandidateSession, job: ApplicationJobRef): ApplicationDraft {
  return startApplicationDetailed(candidate, job).draft;
}

function assertOwnedDraftApplication(candidateId: string, applicationId: string): ApplicationDraft {
  const draft = getApplication(candidateId, applicationId);
  if (!draft) {
    throw new ApplicationError('APPLICATION_NOT_FOUND', `No application "${applicationId}" for this candidate.`);
  }
  if (draft.status !== 'draft') {
    throw new ApplicationError('APPLICATION_ALREADY_SUBMITTED', 'This application has already been submitted.');
  }
  return draft;
}

function assertFreshRevision(draft: ApplicationDraft, expectedRevision: number | null): void {
  if (expectedRevision !== null && expectedRevision !== draft.revision) {
    throw new ApplicationError('STALE_APPLICATION', 'The application has changed since it was last read.', {
      expectedRevision,
      currentRevision: draft.revision,
    });
  }
}

export function updateApplication(
  candidateId: string,
  applicationId: string,
  expectedRevision: number | null,
  patch: Partial<ApplicationFields>,
): ApplicationDraft {
  const draft = assertOwnedDraftApplication(candidateId, applicationId);
  assertFreshRevision(draft, expectedRevision);

  const errors: Partial<Record<keyof ApplicationFields, string>> = {};
  for (const key of Object.keys(patch) as (keyof ApplicationFields)[]) {
    const message = validateApplicationField(key, patch[key] as ApplicationFields[typeof key]);
    if (message) errors[key] = message;
  }
  if (Object.keys(errors).length > 0) {
    throw new ApplicationError('VALIDATION_ERROR', 'One or more fields are invalid.', { errors });
  }

  const changedKeys = (Object.keys(patch) as (keyof ApplicationFields)[]).filter(
    (key) => draft.fields[key] !== patch[key],
  );
  if (changedKeys.length === 0) {
    // No-op patch: don't bump revision (avoids controlled-input echo spinning revisions).
    return draft;
  }

  const updated: ApplicationDraft = {
    ...draft,
    fields: { ...draft.fields, ...patch },
    revision: draft.revision + 1,
    updatedAt: new Date().toISOString(),
  };

  useApplicationsStore.setState((s) => ({
    applications: { ...s.applications, [applicationId]: updated },
  }));

  return updated;
}

export function submitApplication(
  candidateId: string,
  applicationId: string,
  expectedRevision: number | null,
): ApplicationDraft {
  const draft = assertOwnedDraftApplication(candidateId, applicationId);
  assertFreshRevision(draft, expectedRevision);

  const validation = validateApplicationFields(draft.fields);
  if (!validation.valid) {
    throw new ApplicationError('VALIDATION_ERROR', 'This application is missing required information.', {
      errors: validation.errors,
      missingRequiredFields: validation.missingRequiredFields,
    });
  }

  const now = new Date().toISOString();
  const updated: ApplicationDraft = {
    ...draft,
    status: 'submitted',
    submittedAt: now,
    updatedAt: now,
    revision: draft.revision + 1,
  };

  useApplicationsStore.setState((s) => ({
    applications: { ...s.applications, [applicationId]: updated },
  }));

  return updated;
}

export function applicationUrl(draft: ApplicationDraft): string {
  return `/careers/application/${draft.countrySlug}?jobId=${draft.jobId}`;
}
