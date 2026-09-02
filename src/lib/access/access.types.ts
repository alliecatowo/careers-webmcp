
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CLIENT'
  | 'RECRUITER'
  | 'INTERVIEWER'
  | 'CONTRACTOR'
  | 'FINANCE'
  | 'CANDIDATE';

export const userRoles: [UserRole, ...UserRole[]] = [
  'SUPER_ADMIN', 'ADMIN', 'CLIENT', 'RECRUITER', 'INTERVIEWER', 'CONTRACTOR', 'FINANCE', 'CANDIDATE'
];

// All roles that can access the admin panel, for broad checks
export const ALL_ADMIN_ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'RECRUITER', 'INTERVIEWER', 'FINANCE'];

// Granular, action-based permissions
export type Permission =
  | '*' // Wildcard for all permissions

  // Dashboard & Analytics
  | 'dashboard.view'
  | 'analytics.view'

  // Jobs & Content
  | 'jobs.manage' // Create, edit, delete job postings

  // Candidates
  | 'candidates.view'
  | 'candidates.edit'
  | 'candidates.delete'

  // Interviews
  | 'interviews.schedule'
  | 'interviews.feedback'

  // Offers
  | 'offers.view'
  | 'offers.create'
  | 'offers.edit'

  // Projects
  | 'projects.view'
  | 'projects.sign'

  // System & Admin
  | 'users.manage'
  | 'settings.edit'
  | 'audit.view'
  | 'audit.export';
