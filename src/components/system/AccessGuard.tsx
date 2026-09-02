
'use client';

import { usePermission } from '@/hooks/usePermission';
import { Permission } from '@/lib/access/access.types';
import React from 'react';

interface AccessGuardProps {
  permission: Permission;
  resource?: any;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function AccessGuard({ permission, resource, fallback = null, children }: AccessGuardProps) {
  const { allowed } = usePermission(permission, resource);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
