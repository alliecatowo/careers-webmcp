
export type InterviewStatus =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export const interviewStatuses: InterviewStatus[] = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];

// This combines the previous type with the new one from the prompt.
export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  stage: string; // e.g. 'TECHNICAL_ROUND'
  scheduledAt: Date;
  interviewerIds: string[];
  interviewerNames: string[];
  meetingLink: string;
  status: InterviewStatus;
  feedback?: string;
  rating?: number;
  createdAt: string;
}
