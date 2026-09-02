
import { Job } from '@/lib/talent-acquisition';

// Helper to create dates relative to now
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

export const mockJobsForAutomation: Job[] = [
  // 1. A job that should be published by the scheduler
  {
    id: 'auto-job-1',
    status: 'scheduled',
    title: 'Scheduled Job To Be Published',
    publishStartDate: daysAgo(1),
    updatedAt: daysAgo(2),
    // other required fields...
    requisitionCode: 'AUTO-001', countryId: 'country_in', city: 'Pune', departmentId: 'dept_eng_it', employmentType: 'Full-time', experienceBand: 'Senior', workforceType: 'Hybrid', visibility: 'public', description: '', responsibilities: [], qualifications: [], equityEligible: true, relocationSupport: false, visaSponsorship: false, createdAt: daysAgo(2), salaryVisibility: 'Public',
  },
  // 2. A job that should expire
  {
    id: 'auto-job-2',
    status: 'published',
    title: 'Published Job to Expire',
    publishStartDate: daysAgo(30),
    publishEndDate: daysAgo(1),
    updatedAt: daysAgo(30),
    requisitionCode: 'AUTO-002', countryId: 'country_us', city: 'Austin', departmentId: 'dept_sales', employmentType: 'Full-time', experienceBand: 'Mid', workforceType: 'Remote', visibility: 'public', description: '', responsibilities: [], qualifications: [], equityEligible: false, relocationSupport: false, visaSponsorship: false, createdAt: daysAgo(30), salaryVisibility: 'Public',
  },
  // 3. A job that should auto-close due to applicant threshold
  {
    id: 'auto-job-3',
    status: 'published',
    title: 'Job with High Applicant Volume',
    applicants: 250,
    updatedAt: daysAgo(10),
    requisitionCode: 'AUTO-003', countryId: 'country_pl', city: 'Warsaw', departmentId: 'dept_eng_it', employmentType: 'Full-time', experienceBand: 'Lead', workforceType: 'Hybrid', visibility: 'public', description: '', responsibilities: [], qualifications: [], equityEligible: true, relocationSupport: true, visaSponsorship: true, createdAt: daysAgo(10), publishStartDate: daysAgo(10), salaryVisibility: 'Public',
  },
  // 4. A job that should trigger SLA breach (Critical)
  {
    id: 'auto-job-4',
    status: 'internal-review',
    title: 'Critical Job Stuck in Review',
    priority: 'Critical',
    updatedAt: daysAgo(2), // Updated 2 days ago, SLA is 1 day
    requisitionCode: 'AUTO-004', countryId: 'country_gb', city: 'London', departmentId: 'dept_legal', employmentType: 'Contract', experienceBand: 'Senior', workforceType: 'Remote', visibility: 'public', description: '', responsibilities: [], qualifications: [], equityEligible: false, relocationSupport: false, visaSponsorship: false, createdAt: daysAgo(2), salaryVisibility: 'Public',
  },
  // 5. A job that should trigger SLA breach (Normal)
  {
    id: 'auto-job-5',
    status: 'compliance-review',
    title: 'Normal Job Stuck in Review',
    priority: 'Medium',
    updatedAt: daysAgo(4), // Updated 4 days ago, SLA is 3 days
    requisitionCode: 'AUTO-005', countryId: 'country_ca', city: 'Toronto', departmentId: 'dept_hr', employmentType: 'Full-time', experienceBand: 'Mid', workforceType: 'Hybrid', visibility: 'public', description: '', responsibilities: [], qualifications: [], equityEligible: false, relocationSupport: false, visaSponsorship: false, createdAt: daysAgo(4), salaryVisibility: 'Public',
  },
  // Add 45 more to reach 50
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `auto-job-filler-${i}`,
    status: 'published' as const,
    title: `Active Job ${i}`,
    publishStartDate: daysAgo(15 + i),
    publishEndDate: daysFromNow(45 - i),
    updatedAt: daysAgo(5),
    requisitionCode: `AUTO-FILL-${i}`,
    countryId: 'country_in', city: 'Mumbai', departmentId: 'dept_eng_it', employmentType: 'Full-time' as const, experienceBand: 'Mid' as const, workforceType: 'Hybrid' as const, visibility: 'public' as const, description: '', responsibilities: [], qualifications: [], equityEligible: false, relocationSupport: false, visaSponsorship: false, createdAt: daysAgo(20), salaryVisibility: 'Public' as const, applicants: 10 + i, priority: 'Medium' as const,
  }))
];
