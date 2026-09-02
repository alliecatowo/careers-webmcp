
import { PermissionContext } from './permission.context';
import { FieldAccessLevel } from './field-access.types';
import { SystemUser } from '@/modules/users/domain/user.entity';
import { UserRole } from './access.types';

// A rule is a function that takes context and returns a boolean or a field access level.
type Rule = (context: PermissionContext) => boolean | FieldAccessLevel | null;

// The structure to hold all our dynamic rules.
const rules: Partial<Record<UserRole, Partial<Record<string, Rule>>>> = {
  // Rules for ADMIN role
  ADMIN: {
    // Field-level rule for the 'user' resource
    'field:user:role': (context) => {
      // An ADMIN cannot change the role of a SUPER_ADMIN.
      const resourceUser = context.resource as SystemUser;
      if (resourceUser?.role === 'SUPER_ADMIN') {
        return 'read'; // Field is read-only
      }
      return null; // No specific rule applies, fall back to default
    },
    // Action-level rule for deleting a user
    'users.manage': (context) => {
      // An ADMIN cannot delete a SUPER_ADMIN or themselves.
      const resourceUser = context.resource as SystemUser;
      if (resourceUser?.role === 'SUPER_ADMIN' || resourceUser?.id === context.userId) {
        return false; // Action is forbidden
      }
      return null; // No specific rule applies
    },
  },
  SUPER_ADMIN: {
    'users.manage': (context) => {
      // A SUPER_ADMIN cannot delete themselves.
      const resourceUser = context.resource as SystemUser;
      if (resourceUser?.id === context.userId) {
          return false;
      }
      return null;
    }
  },
  // Rules for RECRUITER role
  RECRUITER: {
    // Example of a context-aware rule for editing a candidate.
    // This would be used if recruiters could only edit candidates they are assigned to.
    'candidates.edit': (context) => {
      // const candidate = context.resource as Candidate;
      // if (candidate && candidate.assignedRecruiterId !== context.userId) {
      //   return false; // Can't edit a candidate not assigned to you
      // }
      return null; // For now, we allow it.
    }
  }
};

/**
 * Gets a dynamic rule for a given role and permission key.
 * @param role The user's role.
 * @param key The permission key (e.g., 'candidates.edit' or 'field:user:role').
 * @returns The rule function if it exists, otherwise undefined.
 */
export const getDynamicRule = (role: UserRole, key: string): Rule | undefined => {
  return rules[role]?.[key];
};
