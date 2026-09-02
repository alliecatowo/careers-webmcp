
import { z } from 'zod';

export const applicationStatuses = ["APPLIED", "SCREENED", "TECHNICAL_ROUND", "HR_ROUND", "FINAL_ROUND", "OFFER", "HIRED", "REJECTED", "INTERVIEW", "PLACED"] as const;
export type ApplicationStatus = typeof applicationStatuses[number];

export interface Application {
    id: string;
    candidateId: string;
    jobId: string;
    status: ApplicationStatus;
    createdAt: Date;
    candidateName?: string;
    candidateEmail?: string;
    jobTitle?: string;
    interviewDateTime?: string;
    offerDate?: string;
    score?: number | null;
}

export interface ApplicationWithCandidate extends Application {
    candidateName: string;
    candidateAvatarUrl?: string;
    candidateEmail: string;
}

// Importing these carefully just for the typing
import type { Candidate } from './candidate.types';
import type { Interview } from '@/modules/interviews/domain/interview.entity';
import type { StageHistory } from './stageHistory.types';
import type { Document } from './document.types';

export interface ApplicationDetails {
    application: Application;
    candidate: Candidate;
    interviews: Interview[];
    stageHistory: StageHistory[];
    documents: Document[];
}

const fileSchema = z.any().optional();

export const multiPhaseApplicationSchema = z.object({
    jobId: z.string(),
    // Phase 1
    fullName: z.string().min(2, { message: "Full name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(10, { message: "A valid phone number is required." }),
    preferredWorkModel: z.string().min(1, { message: "Please select a work model." }),
    internshipDuration: z.string().optional(),
    linkedinUrl: z.string().url({ message: "Invalid LinkedIn URL." }).optional().or(z.literal('')),
    portfolioUrl: z.string().url({ message: "Invalid GitHub or Portfolio URL." }).optional().or(z.literal('')),
    resume: fileSchema.refine(file => file?.name, "Resume is required."),
    coverLetter: z.string().max(2000).optional(),
    sourceOfDiscovery: z.string().optional(),
    consentGiven: z.boolean().refine(value => value === true, { message: "You must agree to the privacy policy." }),

    // Phase 2
    primaryExpertise: z.string().min(1, "Please select your primary expertise."),
    frontendTechnologies: z.array(z.string()).optional(),
    frontendTechnologiesOther: z.string().optional(),
    frontendExpertise: z.coerce.number().min(0).max(100).optional(),
    backendTechnologies: z.array(z.string()).optional(),
    backendTechnologiesOther: z.string().optional(),
    backendExpertise: z.coerce.number().min(0).max(100).optional(),
    devopsTechnologies: z.array(z.string()).optional(),
    devopsTechnologiesOther: z.string().optional(),
    devopsExpertise: z.coerce.number().min(0).max(100).optional(),
    projects: z.string().optional(),
    technicalChallengeLink: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
    certifications: fileSchema,
    declaration: z.boolean().refine(value => value === true, { message: "You must declare the information is accurate." }),

    // Phase 3
    nationalId: z.string().optional(),
    taxId: z.string().optional(),
    experienceCertificate: fileSchema,
    lastJobCertificate: fileSchema,
    recommendationLetters: fileSchema,
    photoId: fileSchema,
    selfDeclaration: z.boolean().refine(value => value === true, { message: "Self-declaration is required." }),
});

export type MultiPhaseApplicationData = z.infer<typeof multiPhaseApplicationSchema> & {
    id?: string;
    jobTitle?: string;
};
