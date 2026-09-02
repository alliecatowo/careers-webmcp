import { mockCandidates as allMockCandidates } from '@/mocks/candidates.mock';
import {
  PaginatedCandidatesResponse,
  Candidate,
  CandidateStage,
} from '@/modules/candidates/candidates.types';
import { TableQuery } from '@/components/system/DataTable';
import { mockApplications, mockNotes, mockStageHistories } from '@/mocks';
import { CandidateProfileData } from '@/types';
import { authMockService } from './auth.mock';
import { userMockService } from './user.mock';
import { auditService } from '@/services/audit.service';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const tenantCandidates: Candidate[] = allMockCandidates.map((candidate, i) => ({
  ...candidate,
  tenantId: i % 3 === 0 ? 'org_stark' : 'org_acme',
  avatarUrl: `https://i.pravatar.cc/150?u=candidate${i + 1}`,
}));

let mockCandidates: Candidate[] = [...tenantCandidates];

export const candidateMockService = {
  async getCandidates(query: TableQuery): Promise<PaginatedCandidatesResponse> {
    await delay(500);
    const { page = 1, limit = 10, search, sortBy, sortOrder } = query;
    const tenantId = localStorage.getItem('talent-os-tenant-id');

    let filtered = tenantId
      ? mockCandidates.filter((c) => c.tenantId === tenantId)
      : [];

    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm) ||
          c.jobTitle.toLowerCase().includes(searchTerm),
      );
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default sort
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
      page: page,
      limit: limit,
      totalPages,
    };
  },

  async getById(id: string): Promise<Candidate | undefined> {
    await delay(200);
    return mockCandidates.find((c) => c.id === id);
  },

  async updateStatus(id: string, stage: CandidateStage): Promise<Candidate> {
    await delay(300);
    let updatedCandidate: Candidate | undefined;
    mockCandidates = mockCandidates.map((c) => {
      if (c.id === id) {
        updatedCandidate = { ...c, stage };
        return updatedCandidate;
      }
      return c;
    });
    if (!updatedCandidate) {
      throw new Error('Candidate not found');
    }
    return updatedCandidate;
  },

  async create(
    candidateData: Omit<Candidate, 'id' | 'createdAt' | 'tenantId'>,
  ): Promise<Candidate> {
    await delay(400);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    if (!tenantId) throw new Error('No active tenant selected');

    const newCandidate: Candidate = {
      ...candidateData,
      id: `candidate-${Date.now()}`,
      createdAt: new Date().toISOString(),
      tenantId,
    };
    mockCandidates.unshift(newCandidate);
    return newCandidate;
  },

  async getLatestCandidates(limit: number = 5): Promise<Candidate[]> {
    await delay(300);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    const tenantCandidates = tenantId
      ? mockCandidates.filter((c) => c.tenantId === tenantId)
      : [];
    return [...tenantCandidates]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  },

  async getCandidateProfile(id: string): Promise<CandidateProfileData | null> {
    await delay(600);
    const candidate = mockCandidates.find((c) => c.id === id);
    if (!candidate) return null;

    // Log the audit event for profile view
    const session = await authMockService.checkSession();
    if (session.isAuthenticated && session.userId) {
      const actor = await userMockService.getUserById(session.userId);
      // Only log if an admin/recruiter is viewing, not the candidate themselves
      if (actor && actor.role !== 'CANDIDATE') {
        auditService.logEvent({
          actionType: 'CANDIDATE_PROFILE_VIEWED',
          actorId: actor.id,
          actorName: actor.name,
          entityType: 'candidate',
          entityId: id,
          tenantId: 'org_acme', // Add default tenant ID
          details: { candidateName: candidate.name },
        });
      }
    }

    const { mockJobs } = await import('@/mocks/talent-platform/jobs.mock');

    const applicationsForCandidate = mockApplications
      .filter((app) => app.candidateId === id)
      .map((app) => ({
        ...app,
        jobTitle:
          mockJobs.find((j) => j.id === app.jobId)?.title || 'Unknown Job',
      }));

    const appIds = new Set(applicationsForCandidate.map((app) => app.id));

    return {
      candidate: {
        ...candidate,
        jobId: applicationsForCandidate[0]?.jobId || 'job-1', // Add jobId from first application
        status: applicationsForCandidate[0]?.status || 'APPLIED', // Add status from first application
        appliedAt: new Date(
          applicationsForCandidate[0]?.createdAt || Date.now(),
        ), // Add appliedAt
        country: 'US', // Add default country
        summary:
          'Highly motivated software engineer with a passion for building scalable web applications and a proven track record of delivering high-quality code in fast-paced environments.',
        matchScore: 88,
        fitCategory: 'STRONG_FIT',
        riskFlags: ['Job Hopper Risk'],
        scoreBreakdown: {
          skillMatch: 95,
          experienceMatch: 90,
          seniorityMatch: 80,
          educationMatch: 100,
          locationMatch: 100,
          industryMatch: 70,
          cultureMatch: 85,
        },
      },
      applications: applicationsForCandidate,
      notes: mockNotes.filter((note) => note.candidateId === id),
      stageHistories: mockStageHistories.filter((sh) =>
        appIds.has(sh.applicationId),
      ),
      interviews: [], // Mock for now
    };
  },
};
