'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/contracts';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function AccessDenied() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-200px)] text-center p-8 bg-background">
            <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold text-destructive">Access Restricted</h1>
            <p className="mt-2 text-lg text-muted-foreground">You do not have permission to view this page.</p>
            <p className="mt-1 text-sm text-muted-foreground">Your current role does not grant access. Please switch roles or contact an administrator.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
}

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = <AccessDenied /> }: RoleGuardProps) {
  const { isLoading, role } = useAuth();

  if (isLoading) {
      return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  if (!role || !allowedRoles.includes(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
