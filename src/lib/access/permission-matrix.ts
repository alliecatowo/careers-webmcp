
import { Permission, UserRole } from './access.types';

// Static Role-to-Permission mapping. Dynamic rules are handled separately.
export const rolePermissionMatrix: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ['*'], // Wildcard grants all permissions
  ADMIN: [
    'dashboard.view',
    'analytics.view',
    'jobs.manage',
    'candidates.view',
    'candidates.edit',
    'candidates.delete',
    'interviews.schedule',
    'interviews.feedback',
    'offers.view',
    'offers.create',
    'offers.edit',
    'projects.view',
    'projects.sign',
    'users.manage',
    'settings.edit',
    'audit.view',
    'audit.export',
  ],
  RECRUITER: [
    'dashboard.view',
    'jobs.manage',
    'candidates.view',
    'candidates.edit',
    'interviews.schedule',
    'interviews.feedback',
    'offers.view',
    'offers.create',
    'projects.view',
  ],
  INTERVIEWER: [
    'candidates.view', // Note: This is a broad static permission. Dynamic rules would restrict this to assigned candidates.
    'interviews.feedback',
  ],
  FINANCE: [
    'offers.view',
    'offers.edit',
  ],
  CLIENT: [
    'dashboard.view',
    'projects.view',
  ],
  CONTRACTOR: [
    'dashboard.view',
    'projects.view',
  ],
  CANDIDATE: [], // No admin permissions
};
