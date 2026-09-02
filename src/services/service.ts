/* =========================================================
   SERVICE LAYER ARCHITECTURE
   This layer isolates UI from the data source.
   UI components must ONLY call these services.
========================================================= */

import {
  Project,
  PaginatedResponse,
  ApiResponse,
  Team,
  Milestone,
  WithdrawalRequest,
  ProjectApplication,
  ProjectReview,
  MilestoneStatus,
  Invitation,
  InvitationStatus,
} from '@/types/contracts';

import {
  mockProjects,
  mockTeams,
  mockApplications,
  mockUsers,
  mockMilestones,
  mockInvitations,
  mockReviews,
} from './mockData';

// MOCK UTILITIES (TEMPORARY)
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function mockResponse<T>(data: T | undefined): Promise<ApiResponse<T>> {
  await delay(300);
  if (data !== undefined) {
    return { success: true, data };
  }
  return { success: false, message: 'Not found' };
}

async function mockPaginated<T>(
  array: T[],
  page: number,
  limit: number,
): Promise<ApiResponse<PaginatedResponse<T>>> {
  await delay(300);
  const start = (page - 1) * limit;
  const end = start + limit;
  return Promise.resolve({
    success: true,
    data: {
      data: array.slice(start, end),
      total: array.length,
      page,
      limit,
      totalPages: Math.ceil(array.length / limit),
    },
  });
}

// =========================================================
// PROJECT SERVICE
// =========================================================

export const projectService = {
  async getAll(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<PaginatedResponse<Project>>> {
    return mockPaginated(mockProjects, page, limit);
  },

  async getById(id: string): Promise<ApiResponse<Project>> {
    return mockResponse(mockProjects.find((p) => p.id === id));
  },

  async getTeamsByProjectId(projectId: string): Promise<ApiResponse<Team[]>> {
    await delay(300);
    const teams = mockTeams.filter((t) => t.projectId === projectId);
    return { success: true, data: teams };
  },
};

// =========================================================
// MILESTONE SERVICE
// =========================================================

export const milestoneService = {
  async getAll(): Promise<ApiResponse<PaginatedResponse<Milestone>>> {
    return mockPaginated(mockMilestones, 1, 10);
  },
  async approveMilestone(id: string): Promise<ApiResponse<Milestone>> {
    const milestone = mockMilestones.find((m) => m.id === id);
    if (milestone) milestone.status = 'APPROVED';
    return mockResponse(milestone);
  },
  async rejectMilestone(id: string): Promise<ApiResponse<Milestone>> {
    const milestone = mockMilestones.find((m) => m.id === id);
    if (milestone) milestone.status = 'REJECTED';
    return mockResponse(milestone);
  },
  async submitMilestone(
    id: string,
    submissionUrl: string,
  ): Promise<ApiResponse<Milestone>> {
    const milestone = mockMilestones.find((m) => m.id === id);
    if (milestone) {
      milestone.status = 'SUBMITTED';
      milestone.submissionUrl = submissionUrl;
      milestone.updatedAt = new Date().toISOString();
    }
    return mockResponse(milestone);
  },
};

// =========================================================
// APPLICATION SERVICE
// =========================================================
export const applicationService = {
  async getAll(): Promise<ApiResponse<PaginatedResponse<any>>> {
    return mockPaginated(mockApplications, 1, 10);
  },
  async submitApplication(
    applicationData: Omit<ProjectApplication, 'id' | 'createdAt' | 'status'>,
  ): Promise<ApiResponse<ProjectApplication>> {
    await delay(500);
    const newApplication: ProjectApplication = {
      ...applicationData,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
    };
    mockApplications.push(newApplication);
    return { success: true, data: newApplication };
  },
};

// =========================================================
// TEAM SERVICE
// =========================================================
export const teamService = {
  async createTeam(
    teamData: Omit<Team, 'id' | 'createdAt' | 'status' | 'invitations'>,
  ): Promise<ApiResponse<Team>> {
    await delay(500);
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Active', // Or 'Submitted' based on flow
      invitations: [],
    };
    mockTeams.push(newTeam);
    return { success: true, data: newTeam };
  },
};

// =========================================================
// WITHDRAWAL SERVICE
// =========================================================

const mockWithdrawals: WithdrawalRequest[] = [];

export const withdrawalService = {
  async getAll(): Promise<ApiResponse<PaginatedResponse<WithdrawalRequest>>> {
    return mockPaginated(mockWithdrawals, 1, 10);
  },
};

// =========================================================
// RANKING SERVICE
// =========================================================
export const rankingService = {
  async getRankedApplications(projectId: string): Promise<ApiResponse<any[]>> {
    const apps = mockApplications.filter((a) => a.projectId === projectId);
    // Mock ranking logic
    const rankedApps = apps
      .map((app, i) => ({
        ...app,
        matchScore: {
          finalScore: Math.floor(Math.random() * 50) + 50,
          rankingPosition: i + 1,
        },
      }))
      .sort((a, b) => b.matchScore.finalScore - a.matchScore.finalScore)
      .map((app, i) => ({
        ...app,
        matchScore: { ...app.matchScore, rankingPosition: i + 1 },
      }));

    return { success: true, data: rankedApps };
  },
};

// =========================================================
// REVIEW SERVICE
// =========================================================
export const reviewService = {
  async submitReview(
    review: Omit<ProjectReview, 'id' | 'createdAt'>,
  ): Promise<ApiResponse<ProjectReview>> {
    await delay(400);
    console.log('Submitting review:', review);
    const newReview: ProjectReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockReviews.push(newReview);
    return { success: true, data: newReview };
  },
};

// =========================================================
// INVITATION SERVICE
// =========================================================
export const invitationService = {
  async getForUser(userId: string): Promise<ApiResponse<Invitation[]>> {
    const userInvitations = mockInvitations.filter(
      (inv) => inv.toUserId === userId && inv.status === 'Pending',
    );
    return { success: true, data: userInvitations };
  },
  async respond(
    invitationId: string,
    status: 'Accepted' | 'Declined',
  ): Promise<ApiResponse<Invitation>> {
    await delay(500);
    const invitation = mockInvitations.find((inv) => inv.id === invitationId);
    if (!invitation) return { success: false, message: 'Invitation not found' };

    invitation.status = status;

    if (status === 'Accepted') {
      const team = mockTeams.find((t) => t.id === invitation.teamId);
      if (team) {
        team.members.push({
          userId: invitation.toUserId,
          roleId: invitation.roleId,
          joinedAt: new Date().toISOString(),
        });
      }
    }
    return { success: true, data: invitation };
  },
};
