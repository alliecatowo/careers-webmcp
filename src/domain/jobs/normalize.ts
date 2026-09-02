import type { Job } from '@/lib/talent-acquisition/types/job';
import type { Department } from '@/lib/talent-acquisition/types/department';
import type { Country } from '@/lib/talent-acquisition/types/country';
import type { CareersJob, Compensation, Workplace } from './index';
import { jobUrl } from './url';

function kebab(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const WORKPLACE_MAP: Record<string, Workplace> = {
  Onsite: 'On-site',
  'On-site': 'On-site',
  Hybrid: 'Hybrid',
  Remote: 'Remote',
};

function normalizeWorkplace(value: string | undefined): Workplace | string {
  if (!value) return 'On-site';
  return WORKPLACE_MAP[value] ?? value;
}

function parseCompensation(job: Job): Compensation | null {
  if (typeof job.salaryMin === 'number' && typeof job.salaryMax === 'number') {
    return { min: job.salaryMin, max: job.salaryMax, currency: job.currency ?? 'USD' };
  }
  if (job.salaryBand) {
    const parts = job.salaryBand.split('-').map((p) => parseInt(p.replace(/[^0-9]/g, ''), 10));
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
      return { min: parts[0], max: parts[1], currency: job.currency ?? 'USD' };
    }
  }
  return null;
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]*[.!?]/);
  return (match ? match[0] : text).trim();
}

export function normalizeJob(job: Job, departments: Department[], countries: Country[]): CareersJob {
  const department = departments.find((d) => d.id === job.departmentId);
  const country = countries.find((c) => c.id === job.countryId);
  const countrySlug = country?.slug ?? '';
  const location = job.city + (job.state ? `, ${job.state}` : '');

  return {
    id: job.id,
    slug: job.slug ?? kebab(job.title),
    title: job.title,
    department: department?.name ?? 'Unknown',
    departmentId: job.departmentId,
    team: job.team ?? department?.name ?? 'Unknown',
    level: job.seniorityLevel ?? job.experienceBand ?? 'Unspecified',
    location,
    countrySlug,
    workplace: normalizeWorkplace(job.workforceType),
    employmentType: job.employmentType,
    compensation: parseCompensation(job),
    skills: job.requiredSkills ?? [],
    summary: job.summary ?? firstSentence(job.description),
    description: job.description,
    responsibilities: job.responsibilities ?? [],
    requirements: job.qualifications ?? [],
    postedAt: job.postedAt ?? job.publishStartDate ?? job.createdAt,
    url: jobUrl(countrySlug, job.id),
  };
}
