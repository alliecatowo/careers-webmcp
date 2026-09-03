/**
 * INTERFACE CONTRACT — owned by Sonnet A (semantic job search).
 *
 * Canonical normalized job model + deterministic search used by BOTH the
 * WebMCP tools and (where reasonable) the human UI. Backed by the existing
 * `talentService` / mock adapter — never a second catalog.
 *
 * Implementation lives in ./catalog.ts, ./normalize.ts, ./search.ts and is
 * re-exported here. Signatures below are frozen; other workers code against them.
 */
export type Workplace = 'On-site' | 'Hybrid' | 'Remote';

/** Ordered from most junior to most senior. Used by UI badges and search. */
export const JOB_LEVELS = ['Entry', 'Mid', 'Senior', 'Staff', 'Senior Staff', 'Principal', 'Lead', 'Manager', 'Director'] as const;
export type JobLevel = (typeof JOB_LEVELS)[number];

export interface Compensation {
  min: number;
  max: number;
  currency: string;
}

export interface CareersJob {
  id: string;
  slug: string;
  title: string;
  department: string;
  departmentId: string;
  team: string;
  level: JobLevel | string;
  location: string; // e.g. "San Francisco", "Remote — US"
  countrySlug: string; // needed to build the upstream route
  workplace: Workplace | string;
  employmentType: string;
  compensation: Compensation | null;
  skills: string[];
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string; // ISO
  /** Site-relative URL of the normal job detail page. */
  url: string;
}

/** Compact projection used in search results and saved-job lists. */
export type JobSummary = Pick<
  CareersJob,
  'id' | 'title' | 'department' | 'team' | 'level' | 'location' | 'workplace' | 'employmentType' | 'compensation' | 'url'
>;

export interface JobSearchQuery {
  query?: string;
  departments?: string[];
  levels?: string[];
  locations?: string[];
  workplace?: string[];
  employmentTypes?: string[];
  skills?: string[];
  minCompensation?: number;
  maxCompensation?: number;
  maxResults?: number;
}

export interface JobSearchResult {
  totalMatches: number;
  jobs: JobSummary[];
  truncated: boolean;
}

export const SEARCH_DEFAULT_LIMIT = 10;
export const SEARCH_MAX_LIMIT = 30;

export { getJobCatalog, getCareersJob, jobUrl } from './catalog';
export { normalizeJob } from './normalize';
export { searchJobs, filterAndRankJobs, toJobSummary } from './search';
