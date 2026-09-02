'use client';

import AdminShell from "@/components/layout/AdminShell";
import { RoleGuard } from "@/features/auth/components/RoleGuard";
import { ScrollRestoration } from '@/components/system/ScrollRestoration';

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["CLIENT"]}>
      <ScrollRestoration />
      <AdminShell>
        {children}
      </AdminShell>
    </RoleGuard>
  );
}
