import type { CareersJob, JobSearchQuery, JobSearchResult, JobSummary } from './index';
import { SEARCH_DEFAULT_LIMIT, SEARCH_MAX_LIMIT } from './index';

const LOCATION_ALIASES: Record<string, string[]> = {
  sf: ['san francisco'],
  nyc: ['new york'],
};

function norm(value: string): string {
  return value.toLowerCase().trim();
}

function locationMatches(job: CareersJob, queryLocation: string): boolean {
  const q = norm(queryLocation);
  const jobLocation = norm(job.location);
  const workplace = norm(String(job.workplace));

  if (jobLocation.includes(q) || q.includes(jobLocation)) return true;
  if (q === 'remote' || q.includes('remote')) {
    if (jobLocation.includes('remote') || workplace === 'remote') return true;
  }
  const aliases = LOCATION_ALIASES[q];
  if (aliases?.some((alias) => jobLocation.includes(alias))) return true;
  return false;
}

function passesHardFilters(job: CareersJob, query: JobSearchQuery): boolean {
  if (query.departments?.length) {
    const ok = query.departments.some((d) => {
      const nd = norm(d);
      return norm(job.department).includes(nd) || norm(job.departmentId).includes(nd);
    });
    if (!ok) return false;
  }

  if (query.levels?.length) {
    const ok = query.levels.some((l) => norm(String(job.level)) === norm(l));
    if (!ok) return false;
  }

  if (query.locations?.length) {
    const ok = query.locations.some((loc) => locationMatches(job, loc));
    if (!ok) return false;
  }

  if (query.workplace?.length) {
    const ok = query.workplace.some((w) => norm(String(job.workplace)) === norm(w));
    if (!ok) return false;
  }

  if (query.employmentTypes?.length) {
    const ok = query.employmentTypes.some((t) => norm(job.employmentType) === norm(t));
    if (!ok) return false;
  }

  if (query.skills?.length) {
    const jobSkills = job.skills.map(norm);
    const ok = query.skills.some((s) => jobSkills.some((js) => js.includes(norm(s))));
    if (!ok) return false;
  }

  if (typeof query.minCompensation === 'number') {
    if (!job.compensation || job.compensation.min < query.minCompensation) return false;
  }

  if (typeof query.maxCompensation === 'number') {
    if (!job.compensation || job.compensation.min > query.maxCompensation) return false;
  }

  return true;
}

interface WeightedField {
  weight: number;
  value: string;
}

function fieldsForJob(job: CareersJob): WeightedField[] {
  return [
    { weight: 10, value: job.title },
    { weight: 5, value: job.team },
    { weight: 5, value: job.department },
    { weight: 4, value: job.skills.join(' ') },
    { weight: 3, value: String(job.level) },
    { weight: 3, value: job.location },
    { weight: 2, value: job.summary },
    { weight: 1, value: job.description },
  ];
}

/** Returns [score, matchedAllTokens]. Empty token list is a trivial full match with score 0. */
function scoreJob(job: CareersJob, tokens: string[]): { score: number; matched: boolean } {
  if (tokens.length === 0) return { score: 0, matched: true };
  const fields = fieldsForJob(job).map((f) => ({ weight: f.weight, value: norm(f.value) }));

  let score = 0;
  for (const token of tokens) {
    let tokenMatched = false;
    for (const field of fields) {
      if (field.value.includes(token)) {
        score += field.weight;
        tokenMatched = true;
      }
    }
    if (!tokenMatched) return { score: 0, matched: false };
  }
  return { score, matched: true };
}

export function toJobSummary(job: CareersJob): JobSummary {
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

/** Pure, deterministic search over an already-normalized catalog. No AI, no embeddings. */
export function searchJobs(catalog: CareersJob[], query: JobSearchQuery): JobSearchResult {
  const tokens = (query.query ?? '')
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const requestedLimit = query.maxResults ?? SEARCH_DEFAULT_LIMIT;
  const exceededMax = requestedLimit > SEARCH_MAX_LIMIT;
  const limit = Math.max(0, Math.min(requestedLimit, SEARCH_MAX_LIMIT));

  const scored: { job: CareersJob; score: number }[] = [];
  for (const job of catalog) {
    if (!passesHardFilters(job, query)) continue;
    const { score, matched } = scoreJob(job, tokens);
    if (!matched) continue;
    scored.push({ job, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.job.postedAt !== b.job.postedAt) return a.job.postedAt < b.job.postedAt ? 1 : -1;
    return a.job.id < b.job.id ? -1 : a.job.id > b.job.id ? 1 : 0;
  });

  const totalMatches = scored.length;
  const jobs = scored.slice(0, limit).map((s) => toJobSummary(s.job));
  const truncated = exceededMax || totalMatches > jobs.length;

  return { totalMatches, jobs, truncated };
}
