
import { UserRole } from './access.types';

export interface PermissionContext {
  userRole: UserRole;
  userId: string;
  tenantId?: string;
  resource?: any; // The resource being accessed, e.g., a candidate or user object for dynamic checks
}
