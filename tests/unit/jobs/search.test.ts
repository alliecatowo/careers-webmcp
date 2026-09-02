import { describe, expect, it, beforeAll } from 'vitest';
import {
  searchJobs,
  getJobCatalog,
  getCareersJob,
  SEARCH_DEFAULT_LIMIT,
  SEARCH_MAX_LIMIT,
  type CareersJob,
} from '@/domain/jobs';

function makeJob(overrides: Partial<CareersJob>): CareersJob {
  return {
    id: 'job_fixture',
    slug: 'fixture-job',
    title: 'Fixture Job',
    department: 'Engineering',
    departmentId: 'dept_eng_it',
    team: 'Core Product',
    level: 'Senior',
    location: 'San Francisco, CA',
    countrySlug: 'united-states',
    workplace: 'Hybrid',
    employmentType: 'Full-time',
    compensation: { min: 150000, max: 190000, currency: 'USD' },
    skills: ['TypeScript'],
    summary: 'A fixture job used for isolated search unit tests.',
    description: 'Generic description text with no special keyword content in it.',
    responsibilities: [],
    requirements: [],
    postedAt: '2026-07-01T00:00:00.000Z',
    url: '/careers/countries/united-states/jobs/job_fixture',
    ...overrides,
  };
}

describe('searchJobs (synthetic fixtures)', () => {
  it('matches free-text keywords against title, team, skills, description', () => {
    const catalog = [
      makeJob({ id: 'a', title: 'Staff Platform Engineer' }),
      makeJob({ id: 'b', title: 'Recruiter', description: 'Great with platform-agnostic tooling.' }),
      makeJob({ id: 'c', title: 'Designer', team: 'Design' }),
    ];
    const result = searchJobs(catalog, { query: 'platform' });
    const ids = result.jobs.map((j) => j.id);
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).not.toContain('c');
  });

  it('weights title matches above description-only matches', () => {
    const catalog = [
      makeJob({ id: 'title-match', title: 'Infrastructure Engineer' }),
      makeJob({ id: 'desc-match', title: 'Unrelated Role', description: 'Works occasionally with infrastructure teams.' }),
    ];
    const result = searchJobs(catalog, { query: 'infrastructure' });
    expect(result.jobs[0].id).toBe('title-match');
    expect(result.jobs[1].id).toBe('desc-match');
  });

  it('requires every query token to match (AND semantics)', () => {
    const catalog = [
      makeJob({ id: 'both', title: 'Staff Platform Engineer' }),
      makeJob({ id: 'only-staff', title: 'Staff Recruiter' }),
      makeJob({ id: 'only-platform', title: 'Platform Designer' }),
    ];
    const result = searchJobs(catalog, { query: 'staff platform' });
    expect(result.jobs.map((j) => j.id)).toEqual(['both']);
  });

  it('filters by department', () => {
    const catalog = [
      makeJob({ id: 'eng', department: 'Engineering' }),
      makeJob({ id: 'design', department: 'Design' }),
    ];
    const result = searchJobs(catalog, { departments: ['Engineering'] });
    expect(result.jobs.map((j) => j.id)).toEqual(['eng']);
  });

  it('filters by level', () => {
    const catalog = [
      makeJob({ id: 'staff', level: 'Staff' }),
      makeJob({ id: 'mid', level: 'Mid' }),
    ];
    const result = searchJobs(catalog, { levels: ['Staff'] });
    expect(result.jobs.map((j) => j.id)).toEqual(['staff']);
  });

  it('filters by workplace', () => {
    const catalog = [
      makeJob({ id: 'remote', workplace: 'Remote' }),
      makeJob({ id: 'onsite', workplace: 'On-site' }),
    ];
    const result = searchJobs(catalog, { workplace: ['Remote'] });
    expect(result.jobs.map((j) => j.id)).toEqual(['remote']);
  });

  it('matches locations forgivingly (case-insensitive, remote aliasing, SF alias)', () => {
    const catalog = [
      makeJob({ id: 'sf', location: 'San Francisco, CA', workplace: 'Hybrid' }),
      makeJob({ id: 'remote-us', location: 'Remote — US', workplace: 'Remote' }),
      makeJob({ id: 'ny', location: 'New York, NY', workplace: 'Hybrid' }),
    ];
    expect(searchJobs(catalog, { locations: ['san francisco'] }).jobs.map((j) => j.id)).toEqual(['sf']);
    expect(searchJobs(catalog, { locations: ['SF'] }).jobs.map((j) => j.id)).toEqual(['sf']);
    expect(searchJobs(catalog, { locations: ['Remote'] }).jobs.map((j) => j.id).sort()).toEqual(['remote-us']);
    expect(searchJobs(catalog, { locations: ['Remote — US'] }).jobs.map((j) => j.id)).toEqual(['remote-us']);
  });

  it('applies minCompensation using compensation.min', () => {
    const catalog = [
      makeJob({ id: 'high', compensation: { min: 250000, max: 300000, currency: 'USD' } }),
      makeJob({ id: 'low', compensation: { min: 100000, max: 140000, currency: 'USD' } }),
    ];
    const result = searchJobs(catalog, { minCompensation: 220000 });
    expect(result.jobs.map((j) => j.id)).toEqual(['high']);
  });

  it('returns no matches with totalMatches 0 when nothing satisfies the query', () => {
    const catalog = [makeJob({ id: 'a' })];
    const result = searchJobs(catalog, { query: 'zzz-nonexistent-term' });
    expect(result.totalMatches).toBe(0);
    expect(result.jobs).toEqual([]);
  });

  it('defaults maxResults to SEARCH_DEFAULT_LIMIT and clamps above SEARCH_MAX_LIMIT with truncated=true', () => {
    const catalog = Array.from({ length: 40 }, (_, i) => makeJob({ id: `job-${i}`, postedAt: `2026-07-${String((i % 27) + 1).padStart(2, '0')}T00:00:00.000Z` }));

    const defaultResult = searchJobs(catalog, {});
    expect(defaultResult.jobs.length).toBe(SEARCH_DEFAULT_LIMIT);
    expect(defaultResult.truncated).toBe(true);

    const clamped = searchJobs(catalog, { maxResults: 9999 });
    expect(clamped.jobs.length).toBe(SEARCH_MAX_LIMIT);
    expect(clamped.truncated).toBe(true);
  });

  it('is deterministic across repeated runs', () => {
    const catalog = Array.from({ length: 10 }, (_, i) => makeJob({ id: `job-${i}`, postedAt: `2026-07-${String(i + 1).padStart(2, '0')}T00:00:00.000Z` }));
    const first = searchJobs(catalog, { query: 'fixture' });
    const second = searchJobs(catalog, { query: 'fixture' });
    expect(first).toEqual(second);
  });
});

describe('searchJobs (real seeded catalog)', () => {
  let catalog: CareersJob[];

  beforeAll(async () => {
    catalog = await getJobCatalog();
  });

  it('seeds at least 12 published US jobs', () => {
    expect(catalog.length).toBeGreaterThanOrEqual(12);
  });

  it('runs the BUILD_CONTRACT §41 demo query and returns exactly the 4 expected jobs', () => {
    const result = searchJobs(catalog, {
      departments: ['Engineering'],
      levels: ['Staff', 'Senior Staff', 'Principal'],
      locations: ['San Francisco', 'Remote — US'],
      minCompensation: 220000,
    });

    expect(result.jobs.map((j) => j.id).sort()).toEqual(
      [
        'job_staff_platform',
        'job_staff_ai_infra',
        'job_principal_reliability',
        'job_senior_staff_platform',
      ].sort(),
    );
    expect(result.totalMatches).toBe(4);
  });

  it('getCareersJob returns null for an unknown id', async () => {
    expect(await getCareersJob('job_does_not_exist')).toBeNull();
  });

  it('getCareersJob returns a normalized job for a known id', async () => {
    const job = await getCareersJob('job_staff_platform');
    expect(job).not.toBeNull();
    expect(job?.title).toBe('Staff Platform Engineer');
    expect(job?.compensation).toEqual({ min: 230000, max: 285000, currency: 'USD' });
  });
});
