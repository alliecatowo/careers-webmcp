import { adapter } from './adapter';
import {
  InterviewStatus,
  Interview,
} from '@/modules/interviews/domain/interview.entity';

export const interviewService = {
  getAllInterviews: () => adapter.getAllInterviews(),
  getInterviewsForCandidate: (candidateId: string): Promise<Interview[]> => {
    return adapter.getInterviewsForCandidate(candidateId);
  },
  schedule: (applicationId: string, dateTime: string) =>
    adapter.scheduleInterview(applicationId, dateTime),
  updateStatus: (id: string, status: InterviewStatus) =>
    adapter.updateInterviewStatus(id, status),
  submitFeedback: (id: string, feedback: string, rating: number) =>
    adapter.submitInterviewFeedback(id, feedback, rating),
};
