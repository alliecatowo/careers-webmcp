
import { z } from 'zod';
import { employmentTypes, experienceBands, jobStatuses, workforceTypes } from '@/types/workflow.types';
import { Job } from '@/lib/talent-acquisition/types';

const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const jobCreationSchema = z.object({
  basicInfo: z.object({
    title: z.string().min(5, "Job title must be at least 5 characters."),
    internalCode: z.string().optional(),
    departmentId: z.string().min(1, "Department is required."),
    employmentType: z.enum(employmentTypes),
    workforceType: z.enum(workforceTypes),
    countryId: z.string().min(1, "Country is required."),
    city: z.string().min(2, "City is required."),
    slug: z.string().min(3, "Slug is required.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    summary: z.string().max(200, "Summary cannot exceed 200 characters.").optional(),
  }),

  roleDetails: z.object({
    description: z.string().min(50, "Description must be at least 50 characters."),
    responsibilities: z.array(z.object({ value: z.string().min(10, "Responsibility must be at least 10 characters.") })).min(1),
    requiredQualifications: z.array(z.object({ value: z.string().min(10, "Qualification must be at least 10 characters.") })).min(1),
    preferredQualifications: z.array(z.object({ value: z.string() })).optional(),
    experienceBand: z.enum(experienceBands),
    education: z.string().optional(),
  }),

  skills: z.object({
    required: z.array(skillSchema).min(1, "At least one required skill is necessary."),
    preferred: z.array(skillSchema).optional(),
  }),
  
  compensation: z.object({
    currency: z.string().min(3).max(3),
    minSalary: z.coerce.number().optional(),
    maxSalary: z.coerce.number().optional(),
    frequency: z.enum(['Annual', 'Monthly', 'Hourly']),
    bonus: z.string().optional(),
    equity: z.boolean(),
    visibility: z.enum(['Public', 'Range Only', 'Hidden']),
  }).refine(data => {
    if (data.minSalary && data.maxSalary) {
      return data.maxSalary >= data.minSalary;
    }
    return true;
  }, {
    message: "Max salary must be greater than or equal to min salary.",
    path: ["maxSalary"],
  }),
  
  compliance: z.object({
    workAuth: z.boolean(),
    visaSponsorship: z.boolean(),
    gdprConsent: z.boolean(),
    relocation: z.boolean(),
  }),

  workflow: z.object({
    status: z.enum(jobStatuses),
    publishDate: z.date().optional(),
    expiryDate: z.date().optional(),
    isFeatured: z.boolean(),
    isInternalOnly: z.boolean(),
    allowExternal: z.boolean(),
    hiringManagerId: z.string().optional(),
    approvalChain: z.array(z.string()).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  }).refine(data => {
    if (data.publishDate && data.expiryDate) {
      return data.expiryDate > data.publishDate;
    }
    return true;
  }, {
    message: "Expiration date must be after the publish date.",
    path: ["expiryDate"],
  })
});

export type JobCreationData = z.infer<typeof jobCreationSchema>;

// Helper function to map form data to the final API payload structure.
export const transformToApiPayload = (data: JobCreationData): Partial<Job> => {
  return {
    title: data.basicInfo.title,
    departmentId: data.basicInfo.departmentId,
    employmentType: data.basicInfo.employmentType,
    workforceType: data.basicInfo.workforceType,
    countryId: data.basicInfo.countryId,
    city: data.basicInfo.city,
    description: data.roleDetails.description,
    responsibilities: data.roleDetails.responsibilities.map(r => r.value),
    qualifications: data.roleDetails.requiredQualifications.map(q => q.value),
    experienceBand: data.roleDetails.experienceBand,
    // ... map other fields as necessary
  };
};
