'use client';

import { useState } from 'react';
import { subDays } from 'date-fns';
import { RouteGuard } from '@/components/system/RouteGuard';
import { useAnalytics } from '@/modules/analytics/hooks/useAnalytics';
import { AnalyticsFilters as IAnalyticsFilters } from '@/modules/analytics/domain/analytics.entity';
import { AnalyticsFilters } from '@/modules/analytics/components/AnalyticsFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { KPIGrid } from '@/modules/analytics/components/KPIGrid';
import { ApplicationsTrendChart } from '@/modules/analytics/components/ApplicationsTrendChart';
import { StatusDistributionChart } from '@/modules/analytics/components/StatusDistributionChart';
import { DepartmentHiringChart } from '@/modules/analytics/components/DepartmentHiringChart';

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>

      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<IAnalyticsFilters>({
    dateRange: { from: subDays(new Date(), 90), to: new Date() },
    countries: [],
    departmentIds: [],
  });

  const { data, isLoading } = useAnalytics(filters);

  if (isLoading || !data) {
    return (
      <RouteGuard permission="analytics.view">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Recruitment Analytics
            </h1>
            <p className="text-muted-foreground">
              Monitor key hiring metrics and pipeline health.
            </p>
          </div>

          <AnalyticsFilters filters={filters} setFilters={setFilters} />
          <DashboardSkeleton />
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard permission="analytics.view">
      <div className="flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Recruitment Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor key hiring metrics and pipeline health.
          </p>
        </div>

        <AnalyticsFilters filters={filters} setFilters={setFilters} />

        <KPIGrid kpis={data.kpis!} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ApplicationsTrendChart data={data.applicationsTrend || []} />
          </div>

          <div className="lg:col-span-2">
            <StatusDistributionChart data={data.statusDistribution || []} />
          </div>
        </div>

        <DepartmentHiringChart data={data.departmentHiring || []} />

      </div>
    </RouteGuard>
  );
}