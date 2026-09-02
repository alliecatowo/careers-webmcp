
import { rolePermissionMatrix } from './permission-matrix';
import { Permission, UserRole } from './access.types';
import { PermissionContext } from './permission.context';
import { getDynamicRule } from './permission.rules';
import { FieldAccessLevel, Resource } from './field-access.types';

/**
 * Checks if a role has a static permission from the matrix.
 * Handles the '*' wildcard for SUPER_ADMIN.
 */
function hasStaticPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissionMatrix[role];
  if (!permissions) {
    return false;
  }
  return permissions.includes('*') || permissions.includes(permission);
}

/**
 * Evaluates if a user can perform a specific action based on their context.
 * It first checks for static permissions and then applies dynamic, context-aware rules.
 */
export function canPerformAction(context: PermissionContext, permission: Permission): boolean {
  const { userRole, tenantId, resource } = context;

  // Example of a tenant-aware check. In a real backend, this check would be paramount.
  if (resource && resource.tenantId && resource.tenantId !== tenantId) {
      // This log is helpful for debugging but should be removed in production.
      // console.warn(`Permission check failed: Resource tenant (${resource.tenantId}) does not match user tenant (${tenantId}).`);
      return false;
  }

  // 1. Check static permission matrix first. If not allowed, deny immediately.
  if (!hasStaticPermission(userRole, permission)) {
    return false;
  }

  // 2. Get and apply the dynamic rule, if one exists for this action.
  const dynamicRule = getDynamicRule(userRole, permission);
  if (dynamicRule) {
    const ruleResult = dynamicRule(context);
    // If the rule returns a boolean, it's a definitive grant or deny.
    if (typeof ruleResult === 'boolean') {
      return ruleResult;
    }
  }

  // 3. If static permission exists and no dynamic rule denied it, grant access.
  return true;
}

/**
 * Gets the access level for a specific field on a resource.
 * Defaults to 'write' if the user has the parent 'edit' permission and no specific field rule denies it.
 */
export function getFieldAccess(
  context: PermissionContext,
  resource: Resource,
  field: string
): FieldAccessLevel {
  const { userRole, tenantId, resource: resourceObject } = context;

  // Tenant check: If resource belongs to a different tenant, hide it.
  if (resourceObject && resourceObject.tenantId && resourceObject.tenantId !== tenantId) {
      return 'hidden';
  }

  // Determine the parent permission required to edit the resource at all.
  const parentEditPermissionMap: Record<Resource, Permission | null> = {
    user: 'users.manage',
    candidate: 'candidates.edit',
    offer: 'offers.edit',
    project: 'projects.sign',
    settings: 'settings.edit',
  };
  const parentPermission = parentEditPermissionMap[resource];

  // If user doesn't even have the basic permission to edit the resource, all fields are read-only.
  if (!parentPermission || !hasStaticPermission(userRole, parentPermission)) {
    return 'read';
  }

  // Now, check for a specific field-level dynamic rule.
  const fieldRuleKey = `field:${resource}:${field}`;
  const dynamicRule = getDynamicRule(userRole, fieldRuleKey);

  if (dynamicRule) {
    const ruleResult = dynamicRule(context);
    if (ruleResult === 'hidden' || ruleResult === 'read' || ruleResult === 'write') {
      return ruleResult;
    }
  }
  
  // If no specific rule, and user has parent edit permission, default to 'write'.
  return 'write';
}
