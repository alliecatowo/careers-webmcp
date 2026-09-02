import { z } from 'zod';
import {
  employmentTypes,
  experienceBands,
  jobStatuses,
  workforceTypes,
  EmploymentType,
  ExperienceBand,
  JobStatus,
  SalaryVisibility,
  WorkforceType,
  WorkflowAuditEntry,
} from '@/types/workflow.types';

export { employmentTypes, experienceBands, jobStatuses, workforceTypes };

export type {
  EmploymentType,
  ExperienceBand,
  JobStatus,
  SalaryVisibility,
  WorkforceType,
  WorkflowAuditEntry,
};

export interface Job {
  id: string;
  requisitionCode: string;
  title: string;
  countryId: string;
  city: string;
  state?: string;
  departmentId: string;
  reportingTo?: string;
  employmentType: EmploymentType;
  experienceBand: ExperienceBand;
  workforceType: WorkforceType;
  salaryBand?: string;
  currency?: string;
  salaryVisibility: SalaryVisibility;
  equityEligible: boolean;
  relocationSupport: boolean;
  visaSponsorship: boolean;
  diversityCategory?: string;
  status: JobStatus;
  visibility: 'public' | 'internal';
  description: string;
  responsibilities: string[];
  qualifications: string[];
  isNew?: boolean; // UI-only flag
  publishStartDate?: string;
  publishEndDate?: string;
  createdBy?: string;
  approvedBy?: string;
  // Properties used by scoring system
  experienceRequired?: string;
  remoteAllowed?: boolean;
  seniorityLevel?: string;
  requiredSkills?: string[];
  createdAt: string;
  updatedAt: string;
  // New fields for automation
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  applicants?: number;
  workflowHistory?: WorkflowAuditEntry[];
  tenantId?: string;
  // Workflow scheduling
  publishSchedule?: {
    publishAt: string;
  };
  // Audit tracking
  audit?: {
    updatedBy?: string;
    [key: string]: any;
  };
}

export const jobFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  departmentId: z.string().min(2, 'Department is required.'),
  city: z.string().min(2, 'Location is required.'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters.'),
  responsibilities: z
    .array(z.string())
    .min(1, 'At least one responsibility is required.'),
  qualifications: z
    .array(z.string())
    .min(1, 'At least one qualification is required.'),
  employmentType: z.enum(employmentTypes),
  experienceBand: z.enum(experienceBands),
  workforceType: z.enum(workforceTypes),
  status: z.enum(jobStatuses),
  countryId: z.string().min(1, 'Country is required'),
  equityEligible: z.boolean(),
  relocationSupport: z.boolean(),
  visaSponsorship: z.boolean(),
});

export type JobFormData = z.infer<typeof jobFormSchema>;
