
'use client';

import React from 'react';
import { usePermission } from '@/hooks/usePermission';
import { Permission } from '@/lib/access/access.types';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

function NoPermissionFallback() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="mt-2 text-lg text-muted-foreground">You do not have the necessary permissions to view this page.</p>
            <p className="mt-1 text-sm text-muted-foreground">Please contact your system administrator if you believe this is an error.</p>
            <Button asChild className="mt-6">
                <Link href="/jobs">Go to Dashboard</Link>
            </Button>
        </div>
    );
}

interface RouteGuardProps {
  permission: Permission;
  children: React.ReactNode;
}

export function RouteGuard({ permission, children }: RouteGuardProps) {
  const { isLoading: authIsLoading } = useAuth();
  const { allowed } = usePermission(permission);

  if (authIsLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  if (!allowed) {
    return <NoPermissionFallback />;
  }

  return <>{children}</>;
}
