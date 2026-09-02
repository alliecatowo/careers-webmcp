import {
  Job,
  Application,
  JobStatus,
  EmploymentType,
  ExperienceBand,
} from '@/lib/talent-acquisition';
import { ApplicationStatus } from '@/types';
import { subDays, subMonths } from 'date-fns';

const countries = [
  'country_in',
  'country_us',
  'country_gb',
  'country_ca',
  'country_pl',
  'country_au',
  'country_vn',
  'country_ph',
  'country_ua',
];
const departments = [
  'dept_eng_it',
  'dept_sales',
  'dept_hr',
  'dept_ops',
  'dept_finance',
  'dept_legal',
  'dept_rd',
];
const jobStatuses: JobStatus[] = [
  'published',
  'closed',
  'draft',
  'archived',
  'internal-review',
];
const appStatuses: ApplicationStatus[] = [
  'APPLIED',
  'SCREENED',
  'TECHNICAL_ROUND',
  'HR_ROUND',
  'OFFER',
  'HIRED',
  'REJECTED',
];
const priorities = ['Low', 'Medium', 'High', 'Critical'] as const;

export const mockJobs: Job[] = Array.from({ length: 200 }, (_, i) => {
  const createdAt = subDays(new Date(), i * 2);
  const status = jobStatuses[i % jobStatuses.length];

  let closeDate: string | undefined;
  if (status === 'closed' || status === 'archived') {
    closeDate = new Date(
      createdAt.getTime() + (15 + (i % 15)) * 24 * 60 * 60 * 1000,
    ).toISOString();
  }

  return {
    id: `rep-job-${i}`,
    title: `Software Engineer ${i}`,
    countryId: countries[i % countries.length],
    departmentId: departments[i % departments.length],
    status,
    employmentType: 'Full-time' as EmploymentType,
    experienceBand: 'Mid' as ExperienceBand,
    priority: priorities[i % priorities.length],
    createdAt: createdAt.toISOString(),
    publishStartDate: createdAt.toISOString(),
    updatedAt: subDays(new Date(), i).toISOString(),
    applicants: 10 + i * 2,
    views: 100 + i * 20,
    closeDate,
    // Add other required Job properties
    requisitionCode: `REQ-${i}`,
    city: 'City',
    workforceType: 'Hybrid',
    visibility: 'public',
    description: '',
    responsibilities: [],
    qualifications: [],
    equityEligible: true,
    relocationSupport: false,
    visaSponsorship: false,
    salaryVisibility: 'Public',
  };
});

export const mockApplications: Application[] = Array.from(
  { length: 500 },
  (_, i) => {
    const linkedJob = mockJobs[i % mockJobs.length];
    const daysInStage = 1 + (i % 10);
    return {
      id: `rep-app-${i}`,
      jobId: linkedJob.id,
      status: appStatuses[i % appStatuses.length],
      createdAt: new Date(
        subDays(new Date(linkedJob.createdAt), 1).toISOString(),
      ),
      updatedAt: new Date(subDays(new Date(), daysInStage).toISOString()), // Mock for calculating days in stage
      // Add other required Application properties
      candidateId: `cand-${i}`,
      candidateName: `Applicant ${i}`,
      jobTitle: linkedJob.title,
    };
  },
);
