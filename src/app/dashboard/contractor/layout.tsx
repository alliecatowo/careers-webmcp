'use client';

import AdminShell from "@/components/layout/AdminShell";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ScrollRestoration } from '@/components/system/ScrollRestoration';

export default function ContractorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["CONTRACTOR"]}>
      <ScrollRestoration />
      <AdminShell>
        {children}
      </AdminShell>
    </RoleGuard>
  );
}
