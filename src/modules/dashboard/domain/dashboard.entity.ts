import { Candidate } from '@/modules/candidates/candidates.types';
import { JobSummary } from '@/modules/jobs/jobs.types';

export interface DashboardStats {
  openJobs: number;
  newCandidates: number; // in last 7 days
  interviewsToday: number;
  offersPending: number;
}

export interface PipelineStats {
  stage: string;
  count: number;
}

export interface DashboardData {
  stats: DashboardStats;
  latestCandidates: Candidate[];
  openPositions: JobSummary[];
  pipelineOverview: PipelineStats[];
}
