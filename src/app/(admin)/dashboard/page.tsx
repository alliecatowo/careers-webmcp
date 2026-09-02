'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/modules/dashboard/hooks/useDashboard';
import { WelcomeBanner } from '@/modules/dashboard/components/WelcomeBanner';
import { MetricCard } from '@/modules/dashboard/components/MetricCard';
import { RecentCandidates } from '@/modules/dashboard/components/RecentCandidates';
import { OpenPositions } from '@/modules/dashboard/components/OpenPositions';
import { HiringPipelineChart } from '@/modules/dashboard/components/HiringPipelineChart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Briefcase,
  FilePlus,
  CalendarCheck,
  FileText,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { ALL_ADMIN_ROLES } from '@/lib/access/access.types';

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-24 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { data, isLoading, isError } = useDashboard();

  const isAdminRole = role && ALL_ADMIN_ROLES.includes(role as any);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAdminRole) {
      if (role && role === 'CLIENT') {
        router.replace('/my-account');
      } else {
        router.replace('/');
      }
    }
  }, [role, isAuthLoading, router, isAdminRole]);

  if (isAuthLoading || !isAdminRole) {
    return (
      <div className="flex h-full min-h-[calc(100vh-200px)] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed p-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">
          Could not load dashboard data
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          There was an error fetching the required information. Please try again
          later.
        </p>
      </div>
    );
  }

  const { stats, latestCandidates, openPositions, pipelineOverview } = data;

  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Open Positions"
          value={stats.openJobs}
          icon={<Briefcase />}
          description="Active and accepting candidates"
        />
        <MetricCard
          title="New Candidates"
          value={stats.newCandidates}
          icon={<FilePlus />}
          description="In the last 7 days"
        />
        <MetricCard
          title="Interviews Today"
          value={stats.interviewsToday}
          icon={<CalendarCheck />}
        />
        <MetricCard
          title="Pending Offers"
          value={stats.offersPending}
          icon={<FileText />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <HiringPipelineChart data={pipelineOverview} />
          <OpenPositions jobs={openPositions} />
        </div>
        <div className="space-y-8">
          <RecentCandidates candidates={latestCandidates} />
        </div>
      </div>
    </div>
  );
}
