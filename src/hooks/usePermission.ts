
'use client';

import { useAuth } from '@/hooks/useAuth';
import { canPerformAction, getFieldAccess } from '@/lib/access/permission.evaluator';
import { Permission } from '@/lib/access/access.types';
import { PermissionContext } from '@/lib/access/permission.context';
import { Resource, FieldAccessLevel } from '@/lib/access/field-access.types';
import { useTenant } from '@/context/TenantContext';

/**
 * Creates the permission context from the current authenticated user and tenant.
 */
const usePermissionContext = (resource?: any): PermissionContext | null => {
    const { user } = useAuth();
    const { currentOrganization } = useTenant();
    if (!user) {
        return null;
    }
    return {
        userId: user.id,
        userRole: user.role,
        tenantId: currentOrganization?.id,
        resource,
    };
};

/**
 * Hook to check if the current user can perform a specific action.
 * @param permission The permission to check.
 * @param resource Optional resource object for context-aware rules.
 * @returns An object with an `allowed` boolean property.
 */
export const usePermission = (permission: Permission, resource?: any) => {
  const context = usePermissionContext(resource);

  if (!context) {
    return { allowed: false };
  }

  const allowed = canPerformAction(context, permission);

  return { allowed };
};

/**
 * Hook to get the access level for a specific field on a resource.
 * @param resourceType The type of resource (e.g., 'user', 'candidate').
 * @param field The name of the field to check.
 * @param resource The resource object itself for context-aware rules.
 * @returns The FieldAccessLevel ('write', 'read', or 'hidden').
 */
export const useFieldPermission = (resourceType: Resource, field: string, resource?: any): FieldAccessLevel => {
    const context = usePermissionContext(resource);

    if (!context) {
        return 'hidden'; // If no user, hide everything by default.
    }

    return getFieldAccess(context, resourceType, field);
};
