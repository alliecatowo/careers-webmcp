/**
 * The 11 careers WebMCP tool definitions.
 *
 * Tool `description`/`title` text is authored by us and must NEVER
 * interpolate job/application content (see BUILD_CONTRACT #36). Returned
 * *data* may contain untrusted site/user content; those tools carry
 * `untrustedContentHint: true`.
 */
import { getJobCatalog, getCareersJob, searchJobs, toJobSummary, type JobSearchQuery } from '@/domain/jobs';
import { listSavedJobIds, isJobSaved, setJobSaved } from '@/domain/saved-jobs';
import {
  listApplications,
  getApplication as getApplicationDraft,
  findApplicationByJob,
  startApplication,
  updateApplication,
  submitApplication,
  applicationUrl,
  validateApplicationFields,
  APPLICATION_FIELD_NAMES,
  type ApplicationFields,
  type ApplicationDraft,
} from '@/domain/applications';
import { getCurrentCandidate } from '@/domain/session/session.store';
import { getContext } from './context';
import { navigate, scrollToTop } from './navigation';
import { ok, fail, boundResult } from './results';
import { WebMCPError, toErrorResult } from './errors';
import {
  searchJobsSchema,
  getJobSchema,
  openJobSchema,
  getContextSchema,
  getSavedJobsSchema,
  setSavedJobSchema,
  getMyApplicationsSchema,
  getApplicationSchema,
  startApplicationSchema,
  updateApplicationSchema,
  submitApplicationSchema,
  validateInput,
} from './schemas';

function requireCandidate() {
  const candidate = getCurrentCandidate();
  if (!candidate) {
    throw new WebMCPError('AUTH_REQUIRED', 'Sign in to use this careers feature.');
  }
  return candidate;
}

async function jobApplicationState(candidateId: string | null, jobId: string) {
  if (!candidateId) return { alreadyApplied: false, applicationId: null, status: null, saved: false };
  const app = findApplicationByJob(candidateId, jobId);
  return {
    alreadyApplied: !!app,
    applicationId: app?.id ?? null,
    status: app?.status ?? null,
    saved: isJobSaved(candidateId, jobId),
  };
}

export interface CareersTool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: Record<string, unknown>, options?: { signal?: AbortSignal }) => Promise<unknown>;
}

function isAborted(signal?: AbortSignal): boolean {
  return !!signal?.aborted;
}

export const tools: CareersTool[] = [
  {
    name: 'careers_get_context',
    title: 'Get current careers page context',
    description:
      'Get a bounded snapshot of where the current user is on the careers site: sign-in state, current page, current job/application, and active search filters.',
    inputSchema: getContextSchema,
    annotations: { readOnlyHint: true },
    execute: async (input, options) => {
      try {
        validateInput('careers_get_context', input);
        if (isAborted(options?.signal)) return ok(boundResult(null));
        const context = await getContext();
        return ok(boundResult(context));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_search_jobs',
    title: 'Search open job postings',
    description:
      'Search the current employer job catalog with structured filters (department, level, location, workplace, skills, compensation) or free text. Returns bounded, ranked results.',
    inputSchema: searchJobsSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const query = validateInput('careers_search_jobs', input) as JobSearchQuery;
        if (isAborted(options?.signal)) return ok(boundResult({ totalMatches: 0, jobs: [], truncated: false }));
        const catalog = await getJobCatalog();
        const result = searchJobs(catalog, query);
        return ok(boundResult(result));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_get_job',
    title: 'Get a single job posting',
    description:
      'Retrieve full structured details for a public job opening from the current careers site, including whether the current candidate already applied or saved it.',
    inputSchema: getJobSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_get_job', input) as { jobId?: string };
        if (isAborted(options?.signal)) return ok(boundResult(null));
        let jobId = parsed.jobId;
        if (!jobId) {
          const context = await getContext();
          jobId = context.currentJob?.id;
        }
        if (!jobId) {
          throw new WebMCPError('JOB_NOT_FOUND', 'No job specified and no current job in context.');
        }
        const job = await getCareersJob(jobId);
        if (!job) {
          throw new WebMCPError('JOB_NOT_FOUND', `No job found with id "${jobId}".`, { jobId });
        }
        const candidate = getCurrentCandidate();
        const application = await jobApplicationState(candidate?.id ?? null, job.id);
        return ok(
          boundResult({
            id: job.id,
            title: job.title,
            department: job.department,
            team: job.team,
            level: job.level,
            locations: [job.location],
            workplace: job.workplace,
            employmentType: job.employmentType,
            compensation: job.compensation,
            skills: job.skills,
            summary: job.summary,
            responsibilities: job.responsibilities,
            requirements: job.requirements,
            application,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_open_job',
    title: 'Open a job posting in the browser',
    description:
      'Navigate the current browser tab to the normal job detail page for the given job so the human can read it. Does not create an application.',
    inputSchema: openJobSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_open_job', input) as { jobId: string };
        if (isAborted(options?.signal)) return ok(boundResult({ opened: false }));
        const job = await getCareersJob(parsed.jobId);
        if (!job) {
          throw new WebMCPError('JOB_NOT_FOUND', `No job found with id "${parsed.jobId}".`, { jobId: parsed.jobId });
        }
        navigate(job.url);
        scrollToTop();
        return ok(boundResult({ opened: true, job: toJobSummary(job) }));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_get_saved_jobs',
    title: 'List the current candidate saved jobs',
    description: 'List job postings the signed-in candidate has saved for later.',
    inputSchema: getSavedJobsSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        validateInput('careers_get_saved_jobs', input);
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult({ savedJobs: [] }));
        const ids = listSavedJobIds(candidate.id);
        const catalog = await getJobCatalog();
        const savedJobs = ids
          .map((id) => catalog.find((j) => j.id === id))
          .filter((j): j is NonNullable<typeof j> => !!j)
          .map(toJobSummary);
        return ok(boundResult({ savedJobs }));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_set_saved_job',
    title: 'Save or unsave a job posting',
    description: 'Save or remove a job posting from the signed-in candidate saved list. Uses the same save action as the normal careers site.',
    inputSchema: setSavedJobSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_set_saved_job', input) as { jobId: string; saved: boolean };
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult({ jobId: parsed.jobId, saved: false }));
        const job = await getCareersJob(parsed.jobId);
        if (!job) {
          throw new WebMCPError('JOB_NOT_FOUND', `No job found with id "${parsed.jobId}".`, { jobId: parsed.jobId });
        }
        const saved = setJobSaved(candidate.id, parsed.jobId, parsed.saved);
        return ok(boundResult({ jobId: parsed.jobId, saved }));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_get_my_applications',
    title: 'List the current candidate applications',
    description: 'List the signed-in candidate own job applications with status and revision.',
    inputSchema: getMyApplicationsSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        validateInput('careers_get_my_applications', input);
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult({ applications: [] }));
        const apps = listApplications(candidate.id);
        return ok(
          boundResult({
            applications: apps.map((a: ApplicationDraft) => ({
              id: a.id,
              jobId: a.jobId,
              jobTitle: a.jobTitle,
              status: a.status,
              updatedAt: a.updatedAt,
              revision: a.revision,
              url: applicationUrl(a),
            })),
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_get_application',
    title: 'Get a job application draft',
    description: 'Retrieve the signed-in candidate own application draft or submitted application, including current field values and any missing required fields.',
    inputSchema: getApplicationSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_get_application', input) as { applicationId?: string; jobId?: string };
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult(null));

        let app = null;
        if (parsed.applicationId) {
          app = getApplicationDraft(candidate.id, parsed.applicationId);
        } else if (parsed.jobId) {
          app = findApplicationByJob(candidate.id, parsed.jobId);
        } else {
          const context = await getContext();
          if (context.application) {
            app = getApplicationDraft(candidate.id, context.application.id);
          }
        }

        if (!app) {
          throw new WebMCPError('APPLICATION_NOT_FOUND', 'No matching application found.');
        }

        const validation = validateApplicationFields(app.fields);
        return ok(
          boundResult({
            id: app.id,
            job: { id: app.jobId, title: app.jobTitle },
            status: app.status,
            revision: app.revision,
            fields: app.fields,
            missingRequiredFields: validation.missingRequiredFields,
            url: applicationUrl(app),
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_start_application',
    title: 'Start a job application',
    description: 'Start (or resume) the signed-in candidate application draft for a job, prefilled from their profile, using the same flow as the normal Apply button.',
    inputSchema: startApplicationSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_start_application', input) as { jobId: string };
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult(null));
        const job = await getCareersJob(parsed.jobId);
        if (!job) {
          throw new WebMCPError('JOB_NOT_FOUND', `No job found with id "${parsed.jobId}".`, { jobId: parsed.jobId });
        }
        const existing = findApplicationByJob(candidate.id, job.id);
        const draft = startApplication(candidate, { id: job.id, title: job.title, countrySlug: job.countrySlug });
        navigate(applicationUrl(draft));
        return ok(
          boundResult({
            id: draft.id,
            jobId: draft.jobId,
            status: draft.status,
            revision: draft.revision,
            url: applicationUrl(draft),
            created: !existing,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_update_application',
    title: 'Update a job application draft',
    description: 'Update fields on the signed-in candidate own draft application. Requires the last-read revision; rejected if the human has changed the draft since.',
    inputSchema: updateApplicationSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_update_application', input) as {
          applicationId: string;
          expectedRevision: number | null;
          fields: Partial<ApplicationFields>;
        };
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult(null));
        for (const key of Object.keys(parsed.fields)) {
          if (!APPLICATION_FIELD_NAMES.includes(key as (typeof APPLICATION_FIELD_NAMES)[number])) {
            throw new WebMCPError('VALIDATION_ERROR', `Unknown application field "${key}".`, { field: key });
          }
        }
        const draft = updateApplication(candidate.id, parsed.applicationId, parsed.expectedRevision, parsed.fields);
        const validation = validateApplicationFields(draft.fields);
        return ok(
          boundResult({
            id: draft.id,
            revision: draft.revision,
            status: draft.status,
            fields: draft.fields,
            missingRequiredFields: validation.missingRequiredFields,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_submit_application',
    title: 'Submit a job application',
    description: 'Submit the signed-in candidate draft application using the same validation and submission logic as the normal application form.',
    inputSchema: submitApplicationSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_submit_application', input) as {
          applicationId: string;
          expectedRevision: number | null;
        };
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult(null));
        const draft = submitApplication(candidate.id, parsed.applicationId, parsed.expectedRevision);
        navigate(`/careers/application/${draft.countrySlug}/success?appId=${draft.id}`);
        return ok(
          boundResult({
            id: draft.id,
            status: draft.status,
            revision: draft.revision,
            submittedAt: draft.submittedAt,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
];
