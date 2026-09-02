
import { UserRole as AppUserRole } from '@/lib/access/access.types';

export type UserRole = AppUserRole;
export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'RECRUITER', 'INTERVIEWER', 'FINANCE', 'CANDIDATE'] as const;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  accessToken?: string; // Token is client-side, optional here
  avatarUrl?: string;
}
