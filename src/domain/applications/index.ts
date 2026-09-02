/**
 * INTERFACE CONTRACT — owned by Sonnet C (candidate operations).
 *
 * Canonical application draft state shared by the human application form and
 * the WebMCP application tools. One store, persisted in localStorage, scoped
 * per candidate. Every write bumps `revision`; agent writes must pass the
 * revision they last read (optimistic concurrency). Human form writes pass
 * `expectedRevision = null` (human state always wins).
 *
 * Implementation lives in ./application.store.ts, ./validation.ts and is
 * re-exported here. Signatures below are frozen; other workers code against them.
 */
import type { CandidateSession } from '@/domain/session/session.store';

export type ApplicationStatus = 'draft' | 'submitted' | 'withdrawn';

export interface ApplicationFields {
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

export const APPLICATION_FIELD_NAMES: (keyof ApplicationFields)[] = [
  'fullName',
  'email',
  'phone',
  'location',
  'linkedinUrl',
  'portfolioUrl',
  'yearsExperience',
  'coverNote',
  'availability',
];

export const REQUIRED_APPLICATION_FIELDS: (keyof ApplicationFields)[] = [
  'fullName',
  'email',
  'phone',
  'location',
  'yearsExperience',
  'availability',
];

export interface ApplicationDraft {
  id: string; // "app_<n>" style, deterministic per candidate+job is fine
  candidateId: string;
  jobId: string;
  jobTitle: string;
  countrySlug: string;
  status: ApplicationStatus;
  revision: number; // monotonic, starts at 1
  fields: ApplicationFields;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

export type ApplicationErrorCode =
  | 'AUTH_REQUIRED'
  | 'JOB_NOT_FOUND'
  | 'APPLICATION_NOT_FOUND'
  | 'APPLICATION_ALREADY_SUBMITTED'
  | 'STALE_APPLICATION'
  | 'VALIDATION_ERROR';

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export interface ApplicationValidation {
  valid: boolean;
  /** field -> human-readable message (same rules as the human form) */
  errors: Partial<Record<keyof ApplicationFields, string>>;
  missingRequiredFields: (keyof ApplicationFields)[];
}

export interface ApplicationJobRef {
  id: string;
  title: string;
  countrySlug: string;
}

export {
  useApplicationsStore,
  listApplications,
  getApplication,
  findApplicationByJob,
  startApplication,
  updateApplication,
  submitApplication,
  applicationUrl,
  APPLICATIONS_STORAGE_KEY,
} from './application.store';
export { validateApplicationFields, applicationFieldsSchema } from './validation';

// Signatures (frozen):
//   listApplications(candidateId: string): ApplicationDraft[]                       // newest updated first
//   getApplication(candidateId: string, applicationId: string): ApplicationDraft | null   // only own applications
//   findApplicationByJob(candidateId: string, jobId: string): ApplicationDraft | null
//   startApplication(candidate: CandidateSession, job: ApplicationJobRef): ApplicationDraft
//        - idempotent: returns existing draft/submitted app for that job instead of duplicating
//        - prefills fields from candidate.profile exactly like the human form
//   updateApplication(candidateId, applicationId, expectedRevision: number | null, patch: Partial<ApplicationFields>): ApplicationDraft
//        - throws ApplicationError STALE_APPLICATION { expectedRevision, currentRevision } if mismatch
//        - throws APPLICATION_ALREADY_SUBMITTED if status !== 'draft'
//        - throws VALIDATION_ERROR { errors } if any supplied field fails per-field rules
//        - merges only supplied keys; bumps revision; updates updatedAt
//   submitApplication(candidateId, applicationId, expectedRevision: number | null): ApplicationDraft
//        - throws VALIDATION_ERROR { errors, missingRequiredFields } if required fields missing
//        - sets status 'submitted', submittedAt, bumps revision
//   validateApplicationFields(fields: ApplicationFields): ApplicationValidation
//   applicationUrl(draft): string   -> `/careers/application/${countrySlug}?jobId=${jobId}`
//   useApplicationsStore — zustand hook for UI subscription
export type { CandidateSession };
