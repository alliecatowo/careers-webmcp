/**
 * Flatten domain objects into export rows.
 *
 * Values are stringified here (not at render time) so the CSV the human
 * downloads and the slices the agent reads are byte-identical.
 */
import type { CareersJob } from '@/domain/jobs';
import type { ApplicationDraft } from '@/domain/applications';

export const JOB_EXPORT_COLUMNS = [
  'id',
  'title',
  'department',
  'team',
  'level',
  'location',
  'workplace',
  'employmentType',
  'compensationMin',
  'compensationMax',
  'currency',
  'skills',
  'postedAt',
  'url',
] as const;

export function jobsToRows(jobs: CareersJob[]): Record<string, string>[] {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    department: job.department,
    team: job.team,
    level: job.level,
    location: job.location,
    workplace: job.workplace,
    employmentType: job.employmentType,
    compensationMin: job.compensation ? String(job.compensation.min) : '',
    compensationMax: job.compensation ? String(job.compensation.max) : '',
    currency: job.compensation?.currency ?? '',
    skills: (job.skills ?? []).join('; '),
    postedAt: job.postedAt ?? '',
    url: job.url,
  }));
}

export const APPLICATION_EXPORT_COLUMNS = [
  'id',
  'jobId',
  'jobTitle',
  'status',
  'revision',
  'createdAt',
  'updatedAt',
  'submittedAt',
] as const;

/**
 * Deliberately excludes the candidate's free-text and contact fields: an
 * export is a shareable artifact, and the agent can already read its own
 * draft in full via `careers_get_application`.
 */
export function applicationsToRows(applications: ApplicationDraft[]): Record<string, string>[] {
  return applications.map((app) => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: app.jobTitle,
    status: app.status,
    revision: String(app.revision),
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
    submittedAt: app.submittedAt ?? '',
  }));
}
