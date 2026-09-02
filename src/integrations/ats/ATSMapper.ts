import { Application } from '@/types';
import { Job } from '@/lib/talent-acquisition/types/job';
import {
  ATSApplicationPayload,
  ATSJobPayload,
  InternalApplication,
  InternalJob,
} from './types';

/**
 * Normalizes the internal, detailed Job object into a simpler,
 * standardized format required for ATS integrations.
 * @param job - The full internal Job object.
 * @returns A standardized InternalJob object.
 */
function normalizeJob(job: Job): InternalJob {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    country: job.countryId || 'Unknown',
    department: job.departmentId,
    employmentType: job.employmentType,
    publishDate: job.publishStartDate || new Date().toISOString(),
    expiryDate: job.publishEndDate,
    status: job.status,
  };
}

/**
 * Normalizes the internal, detailed Application object into a simpler,
 * standardized format for ATS integrations.
 * @param application - The full internal Application object.
 * @returns A standardized InternalApplication object.
 */
function normalizeApplication(application: Application): InternalApplication {
  return {
    id: application.id,
    jobId: application.jobId,
    applicant: {
      firstName: 'Mock', // Placeholder, would come from application data
      lastName: 'User',
      email: application.candidateEmail || 'mock@email.com',
      phone: '555-555-5555',
    },
    resume: {
      fileName: `resume_${application.id}.pdf`,
      fileContent: 'mock-base64-content', // In a real scenario, this would be fetched from storage
    },
    status: application.status,
    submittedAt: application.createdAt.toISOString(),
  };
}

/**
 * Maps a normalized internal job to a generic payload for an ATS provider.
 * This is where you would add any provider-specific field transformations if needed,
 * though most mapping is handled by the provider itself.
 * @param internalJob - The normalized internal job.
 * @returns A generic ATSJobPayload.
 */
function mapJobToPayload(internalJob: InternalJob): ATSJobPayload {
  return {
    internalId: internalJob.id,
    title: internalJob.title,
    fullDescription: internalJob.description,
    country: internalJob.country,
    department: internalJob.department,
    employmentType: internalJob.employmentType,
    status: internalJob.status === 'published' ? 'open' : 'closed', // Basic status mapping
  };
}

/**
 * Maps a normalized internal application to a generic payload for an ATS provider.
 * @param internalApplication - The normalized internal application.
 * @returns A generic ATSApplicationPayload.
 */
function mapApplicationToPayload(
  internalApplication: InternalApplication,
): ATSApplicationPayload {
  return {
    internalId: internalApplication.id,
    internalJobId: internalApplication.jobId,
    candidate: internalApplication.applicant,
    resume: internalApplication.resume,
  };
}

export const atsMapper = {
  normalizeJob,
  normalizeApplication,
  mapJobToPayload,
  mapApplicationToPayload,
};
