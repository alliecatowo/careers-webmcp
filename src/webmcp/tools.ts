/**
 * The 18 careers WebMCP tool definitions.
 *
 * Tool `description`/`title` text is authored by us and must NEVER
 * interpolate job/application content (see BUILD_CONTRACT #36). Returned
 * *data* may contain untrusted site/user content; those tools carry
 * `untrustedContentHint: true`.
 */
import {
  getJobCatalog,
  getCareersJob,
  searchJobs,
  filterAndRankJobs,
  toJobSummary,
  type JobSearchQuery,
} from '@/domain/jobs';
import { listSavedJobIds, isJobSaved, setJobSaved } from '@/domain/saved-jobs';
import {
  listApplications,
  getApplication as getApplicationDraft,
  findApplicationByJob,
  startApplication,
  updateApplication,
  applicationUrl,
  validateApplicationFields,
  APPLICATION_FIELD_NAMES,
  type ApplicationFields,
  type ApplicationDraft,
} from '@/domain/applications';
import { getCurrentCandidate } from '@/domain/session/session.store';
import { talentService } from '@/services/talent.service';
import {
  setSignUpFields,
  getSignUpFields,
  validateSignUpFields,
  SIGNUP_FIELD_NAMES,
  type SignUpFields,
} from '@/domain/session/signup.store';
import {
  createExport,
  readExport,
  getExport,
  jobsToRows,
  JOB_EXPORT_COLUMNS,
  applicationsToRows,
  APPLICATION_EXPORT_COLUMNS,
  toCsv,
  EXPORT_PREVIEW_ROWS,
  EXPORT_READ_MAX,
  type ExportDataset,
} from '@/domain/exports';
import {
  SITE_DESTINATIONS,
  destinationPath,
  getDestination,
  HIRING_PROCESS_STEPS,
  INTERNSHIP_SPECIALIZATIONS,
  INTERNSHIP_COMPETENCIES,
  INTERNSHIP_SUMMARY,
  type SiteDestinationId,
  type SiteInfoTopic,
} from '@/domain/site';
import { getContext } from './context';
import { navigate, scrollToTop } from './navigation';
import { ok, fail, boundResult } from './results';
import { WebMCPError, toErrorResult } from './errors';
import { assertRevision } from './revision';
import { highlight, setPendingConfirmation, offerExport, requestFocus, typeIntoSearch } from './presence';
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
  setSearchViewSchema,
  focusApplicationFieldSchema,
  createAccountSchema,
  createExportSchema,
  readExportSchema,
  openPageSchema,
  getSiteInfoSchema,
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
    annotations: { readOnlyHint: true, untrustedContentHint: true },
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
    annotations: { untrustedContentHint: true },
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
        // Flash the job title on arrival so the human's eye lands where the agent looked.
        highlight('job', ['job-title']);
        return ok(boundResult({ opened: true, job: toJobSummary(job) }));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_open_page',
    title: 'Go to a page on this careers site',
    description:
      "Navigate the person's tab to one of this site's own pages by name: the job board, their applications, their saved jobs, the sign-up form, the hiring-process or internship pages, or a prepared export. Use it instead of building a link yourself; careers_get_context lists which pages are available.",
    inputSchema: openPageSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_open_page', input) as {
          page: SiteDestinationId;
          exportId?: string;
        };
        if (isAborted(options?.signal)) return ok(boundResult({ opened: false }));

        const destination = getDestination(parsed.page);
        if (!destination) {
          throw new WebMCPError('VALIDATION_ERROR', `Unknown page "${parsed.page}".`, {
            field: 'page',
            known: SITE_DESTINATIONS.map((d) => d.id),
          });
        }
        // Same rule as every other candidate-scoped tool: no agent-only path.
        if (destination.requiresAuth) requireCandidate();

        const path = destinationPath(parsed.page, parsed.exportId);
        if (!path) {
          throw new WebMCPError('VALIDATION_ERROR', `page "${parsed.page}" requires an exportId.`, {
            field: 'exportId',
          });
        }

        navigate(path);
        scrollToTop();
        return ok(
          boundResult({
            opened: true,
            page: destination.id,
            label: destination.label,
            url: path,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_get_site_info',
    title: 'Read this site\'s own information pages',
    description:
      "Read the employer's authored careers content as structured data: the hiring process end to end, the internship program, and the full list of pages you can send the person to. Use it to answer questions about how hiring works here instead of guessing or reading the rendered page.",
    inputSchema: getSiteInfoSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_get_site_info', input) as { topic?: SiteInfoTopic };
        if (isAborted(options?.signal)) return ok(boundResult(null));

        const signedIn = !!getCurrentCandidate();
        const all = {
          hiring_process: {
            label: 'How hiring works here',
            url: '/careers/hiring-process',
            steps: HIRING_PROCESS_STEPS,
          },
          internship_program: {
            label: 'Internship program',
            url: '/careers/internship-program',
            summary: INTERNSHIP_SUMMARY,
            specializations: INTERNSHIP_SPECIALIZATIONS,
            competencies: INTERNSHIP_COMPETENCIES,
          },
          destinations: SITE_DESTINATIONS.map((d) => ({
            id: d.id,
            label: d.label,
            description: d.description,
            requiresAuth: d.requiresAuth,
            available: d.id === 'export' ? false : !d.requiresAuth || signedIn,
          })),
        };

        if (parsed.topic) {
          return ok(boundResult({ topic: parsed.topic, [parsed.topic]: all[parsed.topic] }));
        }
        return ok(boundResult(all));
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
    annotations: { untrustedContentHint: true },
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
        const updatedFields = Object.keys(parsed.fields);
        // Flash exactly the inputs the agent wrote, so the human can see what changed.
        highlight('field', updatedFields);
        return ok(
          boundResult({
            id: draft.id,
            revision: draft.revision,
            status: draft.status,
            fields: draft.fields,
            updatedFields,
            updatedFieldCount: updatedFields.length,
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
    title: 'Review and hand off a job application for submission',
    description:
      "Check the candidate's draft against the same rules as the normal form, then open it for final review. This site requires the person to press Submit themselves, so this tool does not submit for them: it returns 'awaiting_human_confirmation', or VALIDATION_ERROR listing what is missing.",
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

        const draft = getApplicationDraft(candidate.id, parsed.applicationId);
        if (!draft) {
          throw new WebMCPError('APPLICATION_NOT_FOUND', `No application "${parsed.applicationId}" for this candidate.`);
        }
        if (draft.status === 'submitted') {
          return ok(
            boundResult({
              id: draft.id,
              status: draft.status,
              revision: draft.revision,
              submittedAt: draft.submittedAt,
              alreadySubmitted: true,
            }),
          );
        }
        assertRevision(parsed.expectedRevision, draft.revision);

        // Same rules the human Submit button enforces — fail before we send the
        // person to a form they can't actually complete.
        const validation = validateApplicationFields(draft.fields);
        if (!validation.valid) {
          throw new WebMCPError('VALIDATION_ERROR', 'The application is not ready to submit.', {
            missingRequiredFields: validation.missingRequiredFields,
            invalidFields: Object.keys(validation.errors),
          });
        }

        navigate(applicationUrl(draft));
        setPendingConfirmation({
          kind: 'submit_application',
          targetTestId: 'submit-application',
          label: 'Your application is complete and ready to send.',
          at: Date.now(),
        });

        return ok(
          boundResult({
            id: draft.id,
            status: 'awaiting_human_confirmation',
            applicationStatus: draft.status,
            revision: draft.revision,
            url: applicationUrl(draft),
            message: 'The application is filled in and valid. The person needs to press Submit on the page to send it.',
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },

  {
    name: 'careers_set_search_view',
    title: 'Show a search on the jobs page',
    description:
      "Show a search on the site's own jobs page: opens open-positions, types the query into the visible search box, and applies the filters. Use it after careers_search_jobs to put your results on screen for the person; read results from careers_search_jobs, not from here.",
    inputSchema: setSearchViewSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_set_search_view', input) as {
          query?: string;
          department?: string;
          country?: string;
          level?: string;
          workplace?: string;
          employmentType?: string;
        };
        if (isAborted(options?.signal)) return ok(boundResult({ applied: false }));

        // Resolve human-readable names to the ids the visible filter controls use.
        const [departments, countries] = await Promise.all([
          talentService.getDepartments({}),
          talentService.getCountries({}),
        ]);
        const lower = (v: string) => v.trim().toLowerCase();
        const department = parsed.department
          ? departments.find((d) => lower(d.name) === lower(parsed.department!))
          : undefined;
        if (parsed.department && !department) {
          throw new WebMCPError('VALIDATION_ERROR', `Unknown department "${parsed.department}".`, {
            field: 'department',
            known: departments.map((d) => d.name),
          });
        }
        const country = parsed.country
          ? countries.find((c) => lower(c.name) === lower(parsed.country!) || lower(c.slug) === lower(parsed.country!))
          : undefined;
        if (parsed.country && !country) {
          throw new WebMCPError('VALIDATION_ERROR', `Unknown country "${parsed.country}".`, {
            field: 'country',
            known: countries.map((c) => c.name),
          });
        }

        const params = new URLSearchParams();
        if (department) params.set('departmentId', department.id);
        if (country) params.set('countryId', country.id);
        if (parsed.level) params.set('level', parsed.level);
        if (parsed.workplace) params.set('workplace', parsed.workplace);
        if (parsed.employmentType) params.set('employmentType', parsed.employmentType);
        params.set('page', '1');

        const base = '/careers/open-positions';
        // Land on the filtered page first so the search box is mounted, then type.
        navigate(params.toString() ? `${base}?${params.toString()}` : base);

        const query = parsed.query ?? '';
        await typeIntoSearch(query, {
          signal: options?.signal,
          onCommit: () => {
            const committed = new URLSearchParams(params);
            if (query) committed.set('q', query);
            navigate(`${base}?${committed.toString()}`);
          },
        });

        // Report the same count the page now shows, using the shared catalog.
        const catalog = await getJobCatalog();
        const result = searchJobs(catalog, {
          query: query || undefined,
          departments: department ? [department.name] : undefined,
          levels: parsed.level ? [parsed.level] : undefined,
          workplace: parsed.workplace ? [parsed.workplace] : undefined,
          employmentTypes: parsed.employmentType ? [parsed.employmentType] : undefined,
          maxResults: 1,
        } as JobSearchQuery);

        const applied = new URLSearchParams(params);
        if (query) applied.set('q', query);
        return ok(
          boundResult({
            applied: true,
            url: `${base}?${applied.toString()}`,
            view: {
              query: query || null,
              department: department?.name ?? null,
              country: country?.name ?? null,
              level: parsed.level ?? null,
              workplace: parsed.workplace ?? null,
              employmentType: parsed.employmentType ?? null,
            },
            totalMatches: result.totalMatches,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_focus_application_field',
    title: 'Point the person at an application field',
    description:
      "Open the candidate's application and move the cursor to one field, highlighting it. Use this when the person has to supply something you should not invent — for example their phone number or notice period — so they can see exactly where to type.",
    inputSchema: focusApplicationFieldSchema,
    annotations: { untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_focus_application_field', input) as {
          applicationId?: string;
          field: string;
        };
        const candidate = requireCandidate();
        if (isAborted(options?.signal)) return ok(boundResult({ focused: false }));

        let app: ApplicationDraft | null = null;
        if (parsed.applicationId) {
          app = getApplicationDraft(candidate.id, parsed.applicationId);
        } else {
          const context = await getContext();
          if (context.application) app = getApplicationDraft(candidate.id, context.application.id);
        }
        if (!app) {
          throw new WebMCPError('APPLICATION_NOT_FOUND', 'No matching application found.');
        }

        navigate(applicationUrl(app));
        // The form component owns the ref and performs the focus; no DOM lookup here.
        requestFocus(parsed.field);
        highlight('field', [parsed.field]);

        return ok(
          boundResult({
            focused: true,
            applicationId: app.id,
            field: parsed.field,
            currentValue: app.fields[parsed.field as keyof ApplicationFields] ?? null,
            url: applicationUrl(app),
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_create_account',
    title: 'Prepare a candidate account',
    description:
      "Fill this site's normal sign-up form with details the person gave you and open it for them to confirm. It never creates the account itself: it returns 'awaiting_human_confirmation', and once they press Create account careers_get_context reports them signed in. Never invent an email address.",
    inputSchema: createAccountSchema,
    annotations: {},
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_create_account', input) as Partial<SignUpFields>;
        if (isAborted(options?.signal)) return ok(boundResult(null));

        const existing = getCurrentCandidate();
        if (existing) {
          return ok(
            boundResult({
              alreadySignedIn: true,
              candidate: { id: existing.id, displayName: existing.displayName },
              message: 'Someone is already signed in on this site; no account was created.',
            }),
          );
        }

        const fields = setSignUpFields(parsed, 'agent');
        const validation = validateSignUpFields(fields);
        navigate('/careers/signup');
        setPendingConfirmation({
          kind: 'create_account',
          targetTestId: 'confirm-signup',
          label: validation.valid
            ? 'Your details are filled in — nothing to type.'
            : 'Almost there — a couple of details still needed.',
          at: Date.now(),
        });
        highlight('field', Object.keys(parsed));

        return ok(
          boundResult({
            status: 'awaiting_human_confirmation',
            url: '/careers/signup',
            fields,
            missingRequiredFields: validation.missingRequiredFields,
            invalidFields: validation.invalidFields,
            readyToConfirm: validation.valid,
            message: validation.valid
              ? 'The sign-up form is filled in. The person needs to press Create account to finish.'
              : 'The sign-up form is open but still needs the listed fields before it can be confirmed.',
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_create_export',
    title: 'Prepare a downloadable export',
    description:
      'Build a downloadable CSV and get back a handle to it, not the rows: row count, columns and a short preview. Use it instead of paging search results when you need a whole result set, then read only the slices and columns you need with careers_read_export. The person gets the same file.',
    inputSchema: createExportSchema,
    annotations: { untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_create_export', input) as {
          dataset?: ExportDataset;
          query?: JobSearchQuery;
          columns?: string[];
        };
        if (isAborted(options?.signal)) return ok(boundResult(null));

        const dataset: ExportDataset = parsed.dataset ?? 'jobs';
        let columns: string[];
        let rows: Record<string, string>[];
        let candidateId: string | null = null;
        let label: string;

        if (dataset === 'applications') {
          const candidate = requireCandidate();
          candidateId = candidate.id;
          columns = [...APPLICATION_EXPORT_COLUMNS];
          rows = applicationsToRows(listApplications(candidate.id));
          label = 'My applications';
        } else {
          const catalog = await getJobCatalog();
          // Rank without the search page limit: an export is the "give me
          // everything" path, which is safe precisely because the rows never
          // enter a tool result. The registry still caps at EXPORT_MAX_ROWS.
          const matched = filterAndRankJobs(catalog, (parsed.query ?? {}) as JobSearchQuery);
          columns = [...JOB_EXPORT_COLUMNS];
          rows = jobsToRows(matched);
          candidateId = getCurrentCandidate()?.id ?? null;
          label = parsed.query && Object.keys(parsed.query).length > 0 ? 'Search results' : 'All open positions';
        }

        const requested = parsed.columns?.filter((c) => columns.includes(c));
        if (requested && requested.length > 0) {
          columns = requested;
          rows = rows.map((row) => Object.fromEntries(columns.map((c) => [c, row[c] ?? ''])));
        }

        const record = createExport({ dataset, format: 'csv', columns, rows, label, candidateId });
        offerExport(record.id);

        return ok(
          boundResult({
            exportId: record.id,
            dataset: record.dataset,
            format: record.format,
            label: record.label,
            rowCount: record.rows.length,
            columns: record.columns,
            byteSize: toCsv(record.columns, record.rows).length,
            downloadUrl: `/careers/exports/${record.id}`,
            preview: record.rows.slice(0, EXPORT_PREVIEW_ROWS),
            readHint: `Rows are not included here. Call careers_read_export with this exportId, an offset, a limit of up to ${EXPORT_READ_MAX}, and only the columns you need.`,
          }),
        );
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
  {
    name: 'careers_read_export',
    title: 'Read a slice of an export',
    description:
      'Read a bounded window of rows from an export created by careers_create_export. Narrow the columns to only what you need so you can scan a large result set without pulling every field. Returns hasMore so you know whether to continue.',
    inputSchema: readExportSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute: async (input, options) => {
      try {
        const parsed = validateInput('careers_read_export', input) as {
          exportId: string;
          offset?: number;
          limit?: number;
          columns?: string[];
        };
        if (isAborted(options?.signal)) return ok(boundResult(null));

        const record = getExport(parsed.exportId);
        if (!record) {
          throw new WebMCPError('EXPORT_NOT_FOUND', `No export found with id "${parsed.exportId}".`, {
            exportId: parsed.exportId,
          });
        }
        // An applications export belongs to one candidate; don't serve it to another session.
        if (record.candidateId && record.candidateId !== getCurrentCandidate()?.id) {
          throw new WebMCPError('AUTH_REQUIRED', 'This export belongs to a different candidate session.');
        }

        const slice = readExport(parsed.exportId, {
          offset: parsed.offset,
          limit: parsed.limit,
          columns: parsed.columns,
        });
        return ok(boundResult(slice));
      } catch (err) {
        return fail(toErrorResult(err));
      }
    },
  },
];
