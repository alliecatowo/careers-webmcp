/**
 * `careers_get_context` implementation: "where is the user right now?"
 *
 * Reads the same framework/router state the human UI relies on (ui-context
 * store) plus the canonical session store. Never touches localStorage or the
 * DOM directly. Never includes secrets.
 */
import { getSessionSummary, getCurrentCandidate } from '@/domain/session/session.store';
import { classifyPathname, getSearchViewState, useUiContextStore, type PageKind } from '@/domain/ui-context/ui-context.store';
import { getJobCatalog, getCareersJob } from '@/domain/jobs';
import { findApplicationByJob, getApplication } from '@/domain/applications';

export interface CareersContext {
  session: ReturnType<typeof getSessionSummary>;
  page: { kind: PageKind; path: string };
  currentJob: { id: string; title: string } | null;
  search: {
    query: string | null;
    department: string | null;
    location: string | null;
    workplace: string | null;
  };
  application: { id: string; jobId: string; status: string; revision: number } | null;
}

/** Best-effort parse of `/careers/countries/:slug/jobs/:jobId` when the job
 * detail bridge hasn't published `currentJobId` yet (e.g. first paint). */
function jobIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/careers\/countries\/[^/]+\/jobs\/([^/?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getContext(): Promise<CareersContext> {
  const session = getSessionSummary();
  const ui = useUiContextStore.getState();
  const pathname = ui.pathname ?? '/';
  const queryString = new URLSearchParams(ui.searchParams ?? {}).toString();
  const path = queryString ? `${pathname}?${queryString}` : pathname;
  const kind = classifyPathname(pathname);

  let currentJob: CareersContext['currentJob'] = null;
  const jobId = ui.currentJobId ?? jobIdFromPathname(pathname);
  if (jobId) {
    try {
      const job = await getCareersJob(jobId);
      if (job) currentJob = { id: job.id, title: job.title };
    } catch {
      // Unknown job id in the URL; leave currentJob null rather than throw.
    }
  }

  const rawSearch = getSearchViewState();
  let department: string | null = rawSearch.departmentId ?? null;
  if (rawSearch.departmentId) {
    try {
      const catalog = await getJobCatalog();
      const match = catalog.find((j) => j.departmentId === rawSearch.departmentId);
      if (match) department = match.department;
    } catch {
      // Fall back to the raw id if the catalog isn't reachable.
    }
  }

  const search: CareersContext['search'] = {
    query: rawSearch.query ?? null,
    department,
    location: null,
    workplace: null,
  };

  let application: CareersContext['application'] = null;
  const candidate = getCurrentCandidate();
  if (candidate) {
    if (ui.currentApplicationId) {
      const app = getApplication(candidate.id, ui.currentApplicationId);
      if (app) {
        application = { id: app.id, jobId: app.jobId, status: app.status, revision: app.revision };
      }
    } else if (kind === 'application' && ui.searchParams?.jobId) {
      const app = findApplicationByJob(candidate.id, ui.searchParams.jobId);
      if (app) {
        application = { id: app.id, jobId: app.jobId, status: app.status, revision: app.revision };
      }
    }
  }

  return { session, page: { kind, path }, currentJob, search, application };
}
