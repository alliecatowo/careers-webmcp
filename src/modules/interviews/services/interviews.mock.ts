import { Interview, InterviewStatus } from '../domain/interview.entity';
import { mockUsers } from '@/mocks/users.mock';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const tenantInterviews = [
  {
    id: 'interview-1',
    applicationId: 'app-1',
    candidateId: 'candidate-1',
    candidateName: 'Jane Doe',
    jobTitle: 'Senior Frontend Engineer',
    stage: 'TECHNICAL_ROUND',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    interviewerIds: ['user-interviewer-1'],
    interviewerNames: ['Tim Cook'],
    meetingLink: 'https://meet.baalvion.com/xyz-123',
    status: 'SCHEDULED' as InterviewStatus,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: 'org_acme',
  },
  {
    id: 'interview-2',
    applicationId: 'app-2',
    candidateId: 'candidate-2',
    candidateName: 'John Smith',
    jobTitle: 'Senior Frontend Engineer',
    stage: 'FINAL_ROUND',
    scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    interviewerIds: ['user-recruiter', 'user-interviewer-2'],
    interviewerNames: ['Beth Harmon', 'Elon Musk'],
    meetingLink: 'https://meet.baalvion.com/abc-456',
    status: 'SCHEDULED' as InterviewStatus,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: 'org_stark',
  },
  {
    id: 'interview-3',
    applicationId: 'app-3',
    candidateId: 'candidate-3',
    candidateName: 'Maria Garcia',
    jobTitle: 'Lead Product Designer',
    stage: 'TECHNICAL_ROUND',
    scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // In the past
    interviewerIds: ['user-recruiter'],
    interviewerNames: ['Beth Harmon'],
    meetingLink: 'https://meet.baalvion.com/def-789',
    status: 'COMPLETED' as InterviewStatus,
    feedback: 'Excellent portfolio and strong communication skills.',
    rating: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: 'org_acme',
  },
  {
    id: 'interview-elena-1',
    applicationId: 'app-4',
    candidateId: 'user-candidate',
    candidateName: 'Elena Rodriguez',
    jobTitle: 'Data Scientist',
    stage: 'TECHNICAL_ROUND',
    scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    interviewerIds: ['4'],
    interviewerNames: ['Elon Musk (Stark)'],
    meetingLink: 'https://meet.baalvion.com/elena-123',
    status: 'SCHEDULED' as InterviewStatus,
    createdAt: new Date().toISOString(),
    tenantId: 'org_acme',
  },
];

let mockInterviews: (Interview & { tenantId: string })[] = [
  ...tenantInterviews,
];

export const interviewsMockService = {
  async getAllInterviews(): Promise<Interview[]> {
    await delay(300);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    const tenantData = tenantId
      ? mockInterviews.filter((i) => i.tenantId === tenantId)
      : [];
    return [...tenantData].sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );
  },

  async getInterviewsForCandidate(candidateId: string): Promise<Interview[]> {
    await delay(300);
    return mockInterviews.filter((i) => i.candidateId === candidateId);
  },

  async schedule(
    data: Omit<Interview, 'id' | 'createdAt' | 'status'>,
  ): Promise<Interview> {
    await delay(500);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    if (!tenantId) throw new Error('No active tenant selected');

    const newInterview = {
      ...data,
      id: `interview-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'SCHEDULED',
      tenantId,
    } as Interview & { tenantId: string };

    mockInterviews.unshift(newInterview);
    return newInterview;
  },

  async updateStatus(id: string, status: InterviewStatus): Promise<void> {
    await delay(400);
    mockInterviews = mockInterviews.map((i) =>
      i.id === id ? { ...i, status } : i,
    );
  },

  async submitFeedback(
    id: string,
    feedback: string,
    rating: number,
  ): Promise<void> {
    await delay(400);
    mockInterviews = mockInterviews.map((i) =>
      i.id === id ? { ...i, feedback, rating, status: 'COMPLETED' } : i,
    );
  },
};
