import { describe, expect, it } from 'vitest';
import { normalizeJob, jobUrl } from '@/domain/jobs';
import type { Job } from '@/lib/talent-acquisition/types/job';
import type { Department } from '@/lib/talent-acquisition/types/department';
import type { Country } from '@/lib/talent-acquisition/types/country';

const department: Department = {
  id: 'dept_eng_it',
  name: 'Engineering',
  businessUnit: 'Technology',
  supportedCountryIds: ['country_us'],
  isActive: true,
  displayOrder: 1,
};

const country: Country = {
  id: 'country_us',
  isoCode: 'US',
  name: 'United States',
  slug: 'united-states',
  region: 'North America',
  type: 'strategic-hub',
  hiringModel: 'selective',
  stateFilterEnabled: false,
  overview: 'overview',
  timezone: 'America/New_York',
  currency: 'USD',
  complianceProfileId: 'compliance_us',
  isActive: true,
  displayOrder: 1,
};

function baseJob(overrides: Partial<Job>): Job {
  return {
    id: 'job_x',
    requisitionCode: 'BAAL-US-ENG-999',
    title: 'Example Engineer',
    countryId: 'country_us',
    city: 'San Francisco',
    state: 'CA',
    departmentId: 'dept_eng_it',
    employmentType: 'Full-time',
    experienceBand: 'Senior',
    workforceType: 'Hybrid',
    salaryVisibility: 'Public',
    equityEligible: true,
    relocationSupport: false,
    visaSponsorship: false,
    status: 'published',
    visibility: 'public',
    description: 'First sentence here. Second sentence should be ignored by summary fallback.',
    responsibilities: ['Do things'],
    qualifications: ['Know things'],
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('normalizeJob', () => {
  it('parses compensation from salaryMin/salaryMax when present', () => {
    const job = baseJob({ salaryMin: 230000, salaryMax: 285000, currency: 'USD' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.compensation).toEqual({ min: 230000, max: 285000, currency: 'USD' });
  });

  it('parses compensation from a salaryBand string when salaryMin/Max are absent', () => {
    const job = baseJob({ salaryBand: '120000-150000', currency: 'USD' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.compensation).toEqual({ min: 120000, max: 150000, currency: 'USD' });
  });

  it('returns null compensation when neither is available', () => {
    const job = baseJob({});
    const result = normalizeJob(job, [department], [country]);
    expect(result.compensation).toBeNull();
  });

  it('builds the canonical job URL from country slug and id', () => {
    const job = baseJob({});
    const result = normalizeJob(job, [department], [country]);
    expect(result.url).toBe('/careers/countries/united-states/jobs/job_x');
    expect(jobUrl('united-states', 'job_x')).toBe(result.url);
  });

  it('maps workforceType Onsite to the workplace value On-site', () => {
    const job = baseJob({ workforceType: 'Onsite' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.workplace).toBe('On-site');
  });

  it('combines city and state into location', () => {
    const job = baseJob({ city: 'New York', state: 'NY' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.location).toBe('New York, NY');
  });

  it('falls back to the department name for team when job.team is absent', () => {
    const job = baseJob({});
    const result = normalizeJob(job, [department], [country]);
    expect(result.team).toBe('Engineering');
  });

  it('prefers an explicit job.team over the department name', () => {
    const job = baseJob({ team: 'Infrastructure' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.team).toBe('Infrastructure');
  });

  it('uses seniorityLevel for level when present', () => {
    const job = baseJob({ seniorityLevel: 'Staff' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.level).toBe('Staff');
  });

  it('derives a slug from the title when job.slug is absent', () => {
    const job = baseJob({ title: 'Staff Platform Engineer' });
    const result = normalizeJob(job, [department], [country]);
    expect(result.slug).toBe('staff-platform-engineer');
  });
});
