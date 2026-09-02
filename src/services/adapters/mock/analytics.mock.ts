import {
  AnalyticsData,
  AnalyticsFilters,
  PlatformMetrics,
  MarketplaceHealth,
} from '@/modules/analytics/domain/analytics.entity';
import { AnalyticsService } from '@/modules/analytics/services/analytics.service';
import { mockProjects } from '@/services/mockData';
import { mockUsers } from './user.mock';
import { mockMilestones } from '@/services/mockData';
import {
  subMonths,
  isWithinInterval,
  startOfMonth,
  format,
  differenceInDays,
} from 'date-fns';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PLATFORM_COMMISSION_RATE = 0.1; // 10%

const generateAnalyticsData = (
  filters: AnalyticsFilters,
  tenantId: string,
): AnalyticsData => {
  // NOTE: This mock service does not yet implement tenantId filtering for platform-wide metrics.

  // 1. Filter data based on date range
  const filterByDate = (items: any[]) => {
    if (!filters.dateRange?.from || !filters.dateRange?.to) return items;
    return items.filter((item) =>
      isWithinInterval(new Date(item.createdAt), {
        start: filters.dateRange!.from!,
        end: filters.dateRange!.to!,
      }),
    );
  };

  const filteredProjects = filterByDate(mockProjects);
  const filteredUsers = filterByDate(mockUsers);
  const filteredMilestones = filterByDate(mockMilestones);

  // 2. Calculate Platform KPIs
  const totalUsers = mockUsers.length;
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(
    (p) => p.status === 'ACTIVE',
  ).length;
  const completedProjects = mockProjects.filter(
    (p) => p.status === 'COMPLETED',
  ).length;

  const totalEscrowLocked = filteredMilestones
    .filter(
      (m) =>
        m.status === 'ACTIVE' ||
        m.status === 'SUBMITTED' ||
        m.status === 'UNDER_REVIEW',
    )
    .reduce((sum, m) => sum + m.amount, 0);

  const totalRevenueProcessed = filteredMilestones
    .filter((m) => m.status === 'PAID')
    .reduce((sum, m) => sum + m.amount, 0);

  const platformCommissionEarned =
    totalRevenueProcessed * PLATFORM_COMMISSION_RATE;

  const platformKpis: PlatformMetrics = {
    totalUsers: { value: totalUsers, change: 5.2 },
    activeJobs: activeProjects,
    totalApplications: totalUsers * 2, // Mock calculation
    successfulPlacements: completedProjects,
    totalEscrowLocked: { value: totalEscrowLocked, change: -2.5 },
    totalRevenueProcessed: { value: totalRevenueProcessed, change: 22.8 },
    platformCommissionEarned: { value: platformCommissionEarned, change: 22.8 },
  };

  // 3. Generate Chart Data
  const months = Array.from({ length: 12 }, (_, i) =>
    startOfMonth(subMonths(new Date(), 11 - i)),
  );

  const userGrowthMap = new Map<string, number>();
  months.forEach((month) => userGrowthMap.set(format(month, 'MMM yyyy'), 0));
  filteredUsers.forEach((user) => {
    const monthKey = format(startOfMonth(new Date(user.createdAt)), 'MMM yyyy');
    if (userGrowthMap.has(monthKey)) {
      userGrowthMap.set(monthKey, userGrowthMap.get(monthKey)! + 1);
    }
  });
  const userGrowthTrend = Array.from(userGrowthMap.entries()).map(
    ([date, users]) => ({ date, users }),
  );

  const revenueMap = new Map<string, number>();
  months.forEach((month) => revenueMap.set(format(month, 'MMM yyyy'), 0));
  filteredMilestones
    .filter((m) => m.status === 'PAID')
    .forEach((milestone) => {
      const monthKey = format(
        startOfMonth(new Date(milestone.updatedAt)),
        'MMM yyyy',
      );
      if (revenueMap.has(monthKey)) {
        revenueMap.set(monthKey, revenueMap.get(monthKey)! + milestone.amount);
      }
    });
  const revenueTrend = Array.from(revenueMap.entries()).map(
    ([date, revenue]) => ({ date, revenue }),
  );

  // 4. Marketplace Health Metrics (mocked)
  const marketplaceHealth: MarketplaceHealth = {
    jobFillRate: 92, // percentage
    candidateSatisfaction: 4.2, // out of 5
    employerSatisfaction: 4.5, // out of 5
    averageTimeToHire: 28, // days
    avgTimeToSelection: 7, // days
  };

  return {
    platformKpis,
    marketplaceHealth,
    // Keep old properties for compatibility, but can be empty/mocked
    kpis: {} as any,
    applicationsTrend: [],
    statusDistribution: [],
    departmentHiring: [],
  };
};

export const analyticsMockService: AnalyticsService = {
  async getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsData> {
    await delay(800);
    const tenantId =
      typeof window !== 'undefined'
        ? localStorage.getItem('talent-os-tenant-id')
        : 'org_acme';
    return generateAnalyticsData(filters, tenantId || 'org_acme');
  },
};
