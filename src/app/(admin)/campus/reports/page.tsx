'use client';

import { useAnalytics } from '@/modules/analytics/hooks/useAnalytics';
import { AnalyticsFilters } from '@/modules/analytics/components/AnalyticsFilters';
import { useState } from 'react';
import { AnalyticsFilters as IAnalyticsFilters } from '@/modules/analytics/domain/analytics.entity';
import { subDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { PlacementSuccessPie } from '@/modules/campus/reports/components/PlacementSuccessPie';
import { CollegeStatsBarChart } from '@/modules/campus/reports/components/CollegeStatsBarChart';
import { JobDistributionBarChart } from '@/modules/campus/reports/components/JobDistributionBarChart';

function ReportsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full lg:col-span-2" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function CampusReportsPage() {
  const [filters, setFilters] = useState<IAnalyticsFilters>({
    dateRange: { from: subDays(new Date(), 90), to: new Date() },
    countries: [],
    departmentIds: [],
  });

  const { data, isLoading } = useAnalytics(filters);

  /* ---------------- SAFE FALLBACK VALUES ---------------- */

  const placementRate = Number(data?.placementSuccessRate ?? 0);

  const collegeStats =
    (data?.collegeWiseStats ?? []).map((item: any) => ({
      college: item?.college ?? item?.collegeName ?? 'Unknown',
      applications: Number(item?.applications ?? item?.totalApplications ?? 0),
      placed: Number(item?.placed ?? item?.totalPlaced ?? 0),
    })) || [];

  const jobDistribution =
    (data?.jobDistribution ?? []).map((item: any) => ({
      job: item?.job ?? item?.title ?? item?.role ?? 'Unknown',
      count: Number(item?.count ?? item?.applications ?? 0),
    })) || [];

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col gap-8">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Campus Placement Analytics
        </h1>
        <p className="text-muted-foreground">
          Visualize campus recruitment data and performance metrics.
        </p>
      </div>

      <AnalyticsFilters filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <ReportsSkeleton />
      ) : (
        <div className="space-y-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PlacementSuccessPie rate={placementRate} />

            <div className="lg:col-span-2">
              <CollegeStatsBarChart data={collegeStats} />
            </div>
          </div>

          <JobDistributionBarChart data={jobDistribution} />

        </div>
      )}
    </div>
  );
}