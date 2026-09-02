
import { Application } from './application.types';
import { Note } from './note.types';
import { StageHistory } from './stageHistory.types';
import type { Interview } from '@/modules/interviews/domain/interview.entity';

export type FitCategory = "STRONG_FIT" | "GOOD_FIT" | "MODERATE_FIT" | "WEAK_FIT";

export interface ScoreBreakdown {
    skillMatch: number;
    experienceMatch: number;
    seniorityMatch: number;
    educationMatch: number;
    locationMatch: number;
    industryMatch: number;
    cultureMatch: number;
}

export interface ParsedWorkExperience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}

export interface ParsedEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface ParsedResumeData {
  extractedName: string;
  extractedEmail: string;
  phone: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  technologies: string[];
  education: ParsedEducation[];
  workExperience: ParsedWorkExperience[];
  totalExperienceMonths: number;
  certifications: string[];
  confidenceScore: number;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    jobId: string;
    jobTitle: string;
    status: string;
    appliedAt: Date;
    country: string;
    fitCategory?: FitCategory;
    matchScore?: number;
    parsedData?: ParsedResumeData;
    scoreBreakdown?: ScoreBreakdown;
    summary?: string;
    riskFlags?: string[];
    resumeUrl?: string;
    resumeText?: string;
    parsingCompleted?: boolean;
    scoringCompleted?: boolean;
}

export interface CandidateWithJob extends Candidate {
  jobTitle: string;
}

export interface CandidateProfileData {
    candidate: Candidate;
    applications: Application[];
    interviews: Interview[];
    notes: Note[];
    stageHistories: StageHistory[];
}
