import {
  mockApplications as allMockApplications,
  mockCandidates,
  mockDocuments,
  mockInterviews,
  mockStageHistories,
} from '@/mocks';
import { mockJobs } from '@/mocks/talent-platform/jobs.mock';
import {
  Application,
  ApplicationStatus,
  Candidate,
  ApplicationWithCandidate,
} from '@/types';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

let mockApplications: (Application & {
  interviewDateTime?: string;
  offerDate?: string;
  score?: number | null;
})[] = [...allMockApplications].map((app) => ({
  ...app,
  score: Math.random() > 0.3 ? 50 + Math.floor(Math.random() * 50) : null,
}));

export const applicationMockService = {
  async getApplications(
    query: TableQuery,
  ): Promise<PaginatedResponse<ApplicationWithCandidate>> {
    await delay(500);
    const { page = 1, limit = 10, search, sortBy, sortOrder, filters } = query;

    let filtered = mockApplications.map((app) => {
      const candidate = mockCandidates.find((c) => c.id === app.candidateId);
      const job = mockJobs.find((j) => j.id === app.jobId);
      return {
        ...app,
        candidateName: candidate?.name || 'Unknown',
        candidateEmail: candidate?.email || 'Unknown',
        jobTitle: job?.title || 'Unknown',
      };
    });

    if (filters?.jobId) {
      filtered = filtered.filter((app) => app.jobId === filters.jobId);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.candidateName.toLowerCase().includes(searchTerm) ||
          app.candidateEmail.toLowerCase().includes(searchTerm) ||
          app.jobTitle.toLowerCase().includes(searchTerm),
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async applyForJob(applicationData: any) {
    await delay(1000);
    const newCandidateId = `candidate-${Date.now()}`;
    const newCandidate: Candidate = {
      id: newCandidateId,
      name: applicationData.fullName,
      email: applicationData.email,
      jobId: applicationData.jobId,
      jobTitle: applicationData.jobTitle,
      status: 'APPLIED',
      appliedAt: new Date(),
      country: 'US', // Mock
      // Add missing properties for modules candidate type
    };
    // Note: We're adding to the wrong candidate array - this should be fixed
    // mockCandidates.unshift(newCandidate);

    const newApplication: Application = {
      id: `app-${Date.now()}`,
      candidateId: newCandidateId,
      jobId: applicationData.jobId,
      status: 'APPLIED',
      createdAt: new Date(),
    };
    mockApplications.unshift(newApplication);

    return {
      success: true,
      candidateId: newCandidateId,
      message: 'Application submitted successfully!',
    };
  },

  async getApplicationsForUser(userId: string) {
    await delay(300);

    // This is a targeted fix for the mock dashboard user.
    if (userId === 'user-candidate') {
      const elenasApp = allMockApplications.find((a) => a.id === 'app-4');
      return elenasApp ? [elenasApp] : [];
    }

    const { mockUsers } = await import('@/modules/users/services/user.mock');
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) return [];
    const userCandidateIds = mockCandidates
      .filter((c) => c.email === user.email)
      .map((c) => c.id);
    return mockApplications.filter((app) =>
      userCandidateIds.includes(app.candidateId),
    );
  },

  async getApplicationDetails(id: string) {
    await delay(500);
    const app = mockApplications.find((a) => a.id === id);
    if (!app) return null;

    const candidate = mockCandidates.find((c) => c.id === app.candidateId);
    if (!candidate) return null;

    // Transform the candidate to match the ApplicationDetails interface
    const transformedCandidate = {
      ...candidate,
      jobId: app.jobId,
      status: app.status,
      appliedAt: app.createdAt,
      country: 'US', // Mock country data
      jobTitle: candidate.jobTitle, // Already exists
    };

    return {
      application: app,
      candidate: transformedCandidate,
      interviews: mockInterviews.filter((i) => i.applicationId === id),
      stageHistory: mockStageHistories.filter((sh) => sh.applicationId === id),
      documents: mockDocuments.filter((d) => d.candidateId === app.candidateId),
    };
  },

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ) {
    await delay(300);
    const app = mockApplications.find((a) => a.id === applicationId);
    if (app) {
      app.status = status;

      const cand = mockCandidates.find((c) => c.id === app.candidateId);
      if (cand) (cand as any).stage = status;

      mockStageHistories.push({
        id: `sh-${Date.now()}`,
        applicationId,
        stage: status,
        timestamp: new Date(),
      });

      return app;
    }
    throw new Error('Application not found');
  },

  async scheduleInterview(
    applicationId: string,
    dateTime: string,
  ): Promise<Application> {
    await delay(300);
    const appIndex = mockApplications.findIndex((a) => a.id === applicationId);
    if (appIndex > -1) {
      mockApplications[appIndex].status = 'INTERVIEW';
      mockApplications[appIndex].interviewDateTime = dateTime;
      return mockApplications[appIndex];
    }
    throw new Error('Application not found');
  },

  async sendOffer(applicationId: string): Promise<Application> {
    await delay(300);
    const appIndex = mockApplications.findIndex((a) => a.id === applicationId);
    if (appIndex > -1) {
      mockApplications[appIndex].status = 'PLACED';
      mockApplications[appIndex].offerDate = new Date().toISOString();
      return mockApplications[appIndex];
    }
    throw new Error('Application not found');
  },

  async rejectApplication(applicationId: string): Promise<Application> {
    await delay(300);
    const appIndex = mockApplications.findIndex((a) => a.id === applicationId);
    if (appIndex > -1) {
      mockApplications[appIndex].status = 'REJECTED';
      return mockApplications[appIndex];
    }
    throw new Error('Application not found');
  },
};
