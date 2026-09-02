import { talentService } from '@/services/talent.service';
import type { CareersJob } from './index';
import { normalizeJob } from './normalize';

export { jobUrl } from './url';

const CACHE_TTL_MS = 30_000;

let cachedAt = 0;
let cachedCatalog: Promise<CareersJob[]> | null = null;

async function loadCatalog(): Promise<CareersJob[]> {
  const [jobsResponse, departments, countries] = await Promise.all([
    talentService.getJobs({ status: 'published', visibility: 'public', limit: 100 }),
    talentService.getDepartments({}),
    talentService.getCountries({}),
  ]);
  return jobsResponse.data.map((job) => normalizeJob(job, departments, countries));
}

/** Cached for 30s so repeated WebMCP calls in a session don't refetch on every keystroke. */
export function getJobCatalog(): Promise<CareersJob[]> {
  const now = Date.now();
  if (!cachedCatalog || now - cachedAt > CACHE_TTL_MS) {
    cachedAt = now;
    cachedCatalog = loadCatalog().catch((err) => {
      // Don't poison the cache with a rejected promise.
      cachedCatalog = null;
      throw err;
    });
  }
  return cachedCatalog;
}

/** Returns a single published, public job normalized for display/search, or null if unavailable. */
export async function getCareersJob(jobId: string): Promise<CareersJob | null> {
  const job = await talentService.getJobById(jobId);
  if (!job || job.status !== 'published' || job.visibility !== 'public') return null;
  const [departments, countries] = await Promise.all([
    talentService.getDepartments({}),
    talentService.getCountries({}),
  ]);
  return normalizeJob(job, departments, countries);
}
