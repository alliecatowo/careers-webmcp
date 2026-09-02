/* =========================================================
    CORE ENTITIES & DATA CONTRACTS
========================================================= */

// ---------------
// Enums
// ---------------

import { UserRole } from '@/lib/access/access.types';
export type { UserRole };

export type ProjectStatus = "OPEN" | "ACTIVE" | "COMPLETED" | "DRAFT" | "GOVERNANCE_REVIEW";

export type TeamStatus = "Active" | "Draft" | "Archived";

export type ApplicationStatus = "Draft" | "Submitted" | "Pending" | "Approved" | "Rejected";

export type InvitationStatus = "Pending" | "Accepted" | "Declined" | "Expired";

export type MilestoneStatus = "DRAFT" | "ACTIVE" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "PAID";

// ---------------
// Core Entities
// ---------------

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  skills?: string[];
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  reputationSummary?: ReputationSummary;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  capacity: number;
  filledCount: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  status: 'pending' | 'completed';
}

export interface ProjectTeamMember {
  role: string;
  member: string | null; // User's name
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  deadline?: string;
  maxTeamSize: number;
  roles: Role[];
  createdAt: string;
  updatedAt?: string;
  clientId: string; // Added to link project to a client
  assignedContractorId?: string; // ID of the User (contractor) or Team leader
  milestones?: ProjectMilestone[];
  teams?: ProjectTeamMember[];
  requiredSkills: string[];
  budget: number;
  owner: string;
  currency: string;
  country?: string;
}

export interface Member {
  userId: string;
  roleId: string;
  joinedAt: string;
}

export interface Team {
  id: string;
  projectId: string;
  name: string;
  description: string;
  leaderId: string; // userId
  members: Member[];
  invitations: Invitation[];
  status: TeamStatus;
  createdAt: string;
}

export interface MatchScore {
  finalScore: number;
  rankingPosition?: number;
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  contractorId: string; // The user applying
  teamId?: string; // Optional team
  roleId?: string;
  proposalText: string;
  proposedBudget?: number;
  status: ApplicationStatus;
  createdAt: string;
  matchScore?: MatchScore;
}


export interface Invitation {
  id: string;
  projectId: string;
  teamId: string;
  fromUserId: string;
  toUserId: string;
  roleId: string;
  status: InvitationStatus;
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  submissionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ProjectReview {
  id: string
  projectId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  createdAt: string
}

export interface ReputationSummary {
  userId: string
  averageRating: number
  totalReviews: number
  completedProjects: number
  lastUpdated: string
}


/* =========================================================
   API & SERVICE WRAPPERS
========================================================= */

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errorCode?: string
}
