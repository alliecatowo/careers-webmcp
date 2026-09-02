/**
 * Shared in-memory fakes for '@/domain/jobs', '@/domain/saved-jobs' and
 * '@/domain/applications' used by the webmcp unit tests. Implement the
 * frozen signatures from each domain's index.ts so tests don't depend on
 * whether the real implementations have landed yet.
 */
import { vi } from 'vitest';

/**
 * `useSessionStore` (owned by session.store.ts, not us) persists straight to
 * the global `localStorage`, unlike the saved-jobs/applications stores which
 * have an in-memory fallback for the `node` test environment. Polyfill a
 * trivial in-memory localStorage here so importing the session store doesn't
 * throw under vitest's `node` environment.
 */
if (typeof globalThis.localStorage === 'undefined') {
  const memory = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
    clear: () => memory.clear(),
    key: (index: number) => Array.from(memory.keys())[index] ?? null,
    get length() {
      return memory.size;
    },
  };
}

export interface FakeJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  departmentId: string;
  team: string;
  level: string;
  location: string;
  countrySlug: string;
  workplace: string;
  employmentType: string;
  compensation: { min: number; max: number; currency: string } | null;
  skills: string[];
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
  url: string;
}

export const FAKE_JOBS: FakeJob[] = [
  {
    id: 'job_staff_platform',
    slug: 'staff-platform-engineer',
    title: 'Staff Platform Engineer',
    department: 'Engineering',
    departmentId: 'dept_engineering',
    team: 'Infrastructure',
    level: 'Staff',
    location: 'San Francisco',
    countrySlug: 'united-states',
    workplace: 'Hybrid',
    employmentType: 'Full-time',
    compensation: { min: 230000, max: 285000, currency: 'USD' },
    skills: ['TypeScript', 'Kubernetes'],
    summary: 'Own our platform infrastructure.',
    description: 'A long description of the staff platform engineer role. '.repeat(5),
    responsibilities: ['Design platform APIs', 'Mentor engineers'],
    requirements: ['7+ years experience'],
    postedAt: '2026-08-01T00:00:00.000Z',
    url: '/careers/countries/united-states/jobs/job_staff_platform',
  },
  {
    id: 'job_senior_backend',
    slug: 'senior-backend-engineer',
    title: 'Senior Backend Engineer',
    department: 'Engineering',
    departmentId: 'dept_engineering',
    team: 'Core Product',
    level: 'Senior',
    location: 'Remote — US',
    countrySlug: 'united-states',
    workplace: 'Remote',
    employmentType: 'Full-time',
    compensation: { min: 190000, max: 230000, currency: 'USD' },
    skills: ['Node.js', 'PostgreSQL'],
    summary: 'Build core backend services.',
    description: 'A description of the senior backend engineer role.',
    responsibilities: ['Ship backend features'],
    requirements: ['4+ years experience'],
    postedAt: '2026-07-15T00:00:00.000Z',
    url: '/careers/countries/united-states/jobs/job_senior_backend',
  },
];

export function findFakeJob(jobId: string): FakeJob | null {
  return FAKE_JOBS.find((j) => j.id === jobId) ?? null;
}

export function toFakeSummary(job: FakeJob) {
  return {
    id: job.id,
    title: job.title,
    department: job.department,
    team: job.team,
    level: job.level,
    location: job.location,
    workplace: job.workplace,
    employmentType: job.employmentType,
    compensation: job.compensation,
    url: job.url,
  };
}

/**
 * Singleton, shaped like '@/domain/jobs'. Import this directly into a test
 * file's `vi.mock('@/domain/jobs', () => jobsModule)` call.
 *
 * IMPORTANT: `vi.mock` factories are hoisted above the test file's own
 * top-level `const`s, so the factory may only reference *imported* bindings
 * (already-initialized module exports), never a local variable computed by
 * calling a function inline in the same file. Hence this is a ready-made
 * object, not a factory the test file has to call.
 */
export const jobsModule = {
  SEARCH_DEFAULT_LIMIT: 10,
  SEARCH_MAX_LIMIT: 30,
  getJobCatalog: vi.fn(async () => FAKE_JOBS),
  getCareersJob: vi.fn(async (jobId: string) => findFakeJob(jobId)),
  jobUrl: (countrySlug: string, jobId: string) => `/careers/countries/${countrySlug}/jobs/${jobId}`,
  toJobSummary: (job: FakeJob) => toFakeSummary(job),
  searchJobs: (catalog: FakeJob[], query: { query?: string; maxResults?: number }) => {
    let jobs = catalog;
    if (query.query) {
      const q = query.query.toLowerCase();
      jobs = jobs.filter((j) => j.title.toLowerCase().includes(q));
    }
    const limit = Math.min(query.maxResults ?? 10, 30);
    return {
      totalMatches: jobs.length,
      jobs: jobs.slice(0, limit).map(toFakeSummary),
      truncated: jobs.length > limit,
    };
  },
};

interface FakeSavedState {
  saved: Record<string, Set<string>>;
}

const savedJobsState: FakeSavedState = { saved: {} };

/** Clears saved-job state between tests (call from beforeEach). */
export function resetSavedJobsFixture(): void {
  savedJobsState.saved = {};
}

/**
 * Singleton, shaped like '@/domain/saved-jobs'. Same import-not-factory
 * hoisting caveat as `jobsModule` above.
 */
export const savedJobsModule = {
  listSavedJobIds: (candidateId: string) => Array.from(savedJobsState.saved[candidateId] ?? []),
  isJobSaved: (candidateId: string, jobId: string) => !!savedJobsState.saved[candidateId]?.has(jobId),
  setJobSaved: (candidateId: string, jobId: string, saved: boolean) => {
    if (!savedJobsState.saved[candidateId]) savedJobsState.saved[candidateId] = new Set();
    if (saved) savedJobsState.saved[candidateId].add(jobId);
    else savedJobsState.saved[candidateId].delete(jobId);
    return saved;
  },
};

export const APPLICATION_FIELD_NAMES = [
  'fullName',
  'email',
  'phone',
  'location',
  'linkedinUrl',
  'portfolioUrl',
  'yearsExperience',
  'coverNote',
  'availability',
] as const;

export const REQUIRED_APPLICATION_FIELDS = ['fullName', 'email', 'phone', 'location', 'yearsExperience', 'availability'] as const;

export interface FakeApplicationFields {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearsExperience: number | null;
  coverNote: string;
  availability: string;
}

export interface FakeApplication {
  id: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  countrySlug: string;
  status: 'draft' | 'submitted' | 'withdrawn';
  revision: number;
  fields: FakeApplicationFields;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

export class FakeApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

function isEmpty(v: unknown) {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

const applicationsState = {
  applications: new Map<string, FakeApplication>(),
  nextId: 1,
};

/** Clears application draft state between tests (call from beforeEach). */
export function resetApplicationsFixture(): void {
  applicationsState.applications.clear();
  applicationsState.nextId = 1;
}

/** Read-only accessor for assertions in tests. */
export function getFakeApplications(): Map<string, FakeApplication> {
  return applicationsState.applications;
}

/**
 * Singleton, shaped like '@/domain/applications'. Same import-not-factory
 * hoisting caveat as `jobsModule` above.
 */
export const applicationsModule = (() => {
  const applications = applicationsState.applications;
  const nextIdRef = applicationsState;

  return {
      APPLICATION_FIELD_NAMES,
      REQUIRED_APPLICATION_FIELDS,
      ApplicationError: FakeApplicationError,
      listApplications: (candidateId: string) =>
        Array.from(applications.values())
          .filter((a) => a.candidateId === candidateId)
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
      getApplication: (candidateId: string, applicationId: string) => {
        const app = applications.get(applicationId);
        if (!app || app.candidateId !== candidateId) return null;
        return app;
      },
      findApplicationByJob: (candidateId: string, jobId: string) =>
        Array.from(applications.values()).find((a) => a.candidateId === candidateId && a.jobId === jobId) ?? null,
      startApplication: (
        candidate: { id: string; profile: Partial<FakeApplicationFields> },
        job: { id: string; title: string; countrySlug: string },
      ) => {
        const existing = Array.from(applications.values()).find(
          (a) => a.candidateId === candidate.id && a.jobId === job.id,
        );
        if (existing) return existing;
        const id = `app_${nextIdRef.nextId++}`;
        const now = new Date().toISOString();
        const profile = candidate.profile;
        const draft: FakeApplication = {
          id,
          candidateId: candidate.id,
          jobId: job.id,
          jobTitle: job.title,
          countrySlug: job.countrySlug,
          status: 'draft',
          revision: 1,
          fields: {
            fullName: profile.fullName ?? '',
            email: profile.email ?? '',
            phone: profile.phone ?? '',
            location: profile.location ?? '',
            linkedinUrl: profile.linkedinUrl ?? '',
            portfolioUrl: profile.portfolioUrl ?? '',
            yearsExperience: profile.yearsExperience ?? null,
            coverNote: '',
            availability: '',
          },
          createdAt: now,
          updatedAt: now,
          submittedAt: null,
        };
        applications.set(id, draft);
        return draft;
      },
      updateApplication: (
        candidateId: string,
        applicationId: string,
        expectedRevision: number | null,
        patch: Partial<FakeApplicationFields>,
      ) => {
        const draft = applications.get(applicationId);
        if (!draft || draft.candidateId !== candidateId) {
          throw new FakeApplicationError('APPLICATION_NOT_FOUND', 'No such application.');
        }
        if (draft.status !== 'draft') {
          throw new FakeApplicationError('APPLICATION_ALREADY_SUBMITTED', 'Already submitted.');
        }
        if (expectedRevision !== null && expectedRevision !== draft.revision) {
          throw new FakeApplicationError('STALE_APPLICATION', 'Stale revision.', {
            expectedRevision,
            currentRevision: draft.revision,
          });
        }
        const updated: FakeApplication = {
          ...draft,
          fields: { ...draft.fields, ...patch },
          revision: draft.revision + 1,
          updatedAt: new Date().toISOString(),
        };
        applications.set(applicationId, updated);
        return updated;
      },
      submitApplication: (candidateId: string, applicationId: string, expectedRevision: number | null) => {
        const draft = applications.get(applicationId);
        if (!draft || draft.candidateId !== candidateId) {
          throw new FakeApplicationError('APPLICATION_NOT_FOUND', 'No such application.');
        }
        if (draft.status !== 'draft') {
          throw new FakeApplicationError('APPLICATION_ALREADY_SUBMITTED', 'Already submitted.');
        }
        if (expectedRevision !== null && expectedRevision !== draft.revision) {
          throw new FakeApplicationError('STALE_APPLICATION', 'Stale revision.', {
            expectedRevision,
            currentRevision: draft.revision,
          });
        }
        const missing = REQUIRED_APPLICATION_FIELDS.filter((f) => isEmpty(draft.fields[f]));
        if (missing.length > 0) {
          throw new FakeApplicationError('VALIDATION_ERROR', 'Missing required fields.', {
            missingRequiredFields: missing,
          });
        }
        const now = new Date().toISOString();
        const updated: FakeApplication = {
          ...draft,
          status: 'submitted',
          submittedAt: now,
          updatedAt: now,
          revision: draft.revision + 1,
        };
        applications.set(applicationId, updated);
        return updated;
      },
      applicationUrl: (draft: FakeApplication) => `/careers/application/${draft.countrySlug}?jobId=${draft.jobId}`,
      validateApplicationFields: (fields: FakeApplicationFields) => {
        const missingRequiredFields = REQUIRED_APPLICATION_FIELDS.filter((f) => isEmpty(fields[f]));
        return { valid: missingRequiredFields.length === 0, errors: {}, missingRequiredFields };
      },
  };
})();

