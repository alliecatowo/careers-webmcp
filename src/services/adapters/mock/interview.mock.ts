
import { mockInterviews as allMockInterviews } from "@/mocks/interviews.mock";
import { Interview, InterviewStatus } from "@/modules/interviews/domain/interview.entity";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const tenantInterviews = allMockInterviews.map((interview, i) => ({
    ...interview,
    tenantId: i % 2 === 0 ? 'org_acme' : 'org_stark',
}));

tenantInterviews.push({
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
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
    tenantId: 'org_acme',
});

let mockInterviews: (Interview & { tenantId: string })[] = [...tenantInterviews];


export const interviewsMockService = {
  async getAllInterviews(): Promise<Interview[]> {
    await delay(300);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    const tenantData = tenantId ? mockInterviews.filter(i => i.tenantId === tenantId) : [];
    return [...tenantData].sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  },
  
  async getInterviewsForCandidate(candidateId: string): Promise<Interview[]> {
    await delay(300);
    return mockInterviews.filter(i => i.candidateId === candidateId);
  },

  async schedule(data: Omit<Interview, 'id' | 'createdAt' | 'status'>): Promise<Interview> {
    await delay(500);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    if (!tenantId) throw new Error("No active tenant selected");
    
    const newInterview = {
      ...data,
      id: `interview-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'SCHEDULED',
      tenantId,
    } as (Interview & { tenantId: string });

    mockInterviews.unshift(newInterview);
    return newInterview;
  },

  async updateStatus(id: string, status: InterviewStatus): Promise<void> {
    await delay(400);
    mockInterviews = mockInterviews.map((i) =>
      i.id === id ? { ...i, status } : i
    );
  },

  async submitFeedback(id: string, feedback: string, rating: number): Promise<void> {
    await delay(400);
    mockInterviews = mockInterviews.map((i) =>
      i.id === id ? { ...i, feedback, rating, status: 'COMPLETED' } : i
    );
  },
};
