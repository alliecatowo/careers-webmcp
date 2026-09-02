import { JobStatus } from '@/lib/talent-acquisition';

export interface AnalyticsFilters {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  countries?: string[];
  departmentIds?: string[];
}

export interface KpiMetric {
  value: number;
  change: number;
}

export interface KpiData {
  totalActiveJobs: KpiMetric;
  totalApplications: KpiMetric;
  avgTimeToFill: KpiMetric;
  overallConversionRate: KpiMetric;
}

export interface ApplicationsTrendItem {
  date: string;
  applications: number;
}

export interface StatusDistributionItem {
  name: JobStatus;
  value: number;
  fill: string;
}

export interface DepartmentHiringItem {
  department: string;
  hires: number;
}

export interface CollegeStatsItem {
  college: string;
  placements: number;
  students: number;
}

export interface JobDistributionItem {
  role: string;
  count: number;
}

export interface PlatformMetrics {
  totalUsers: { value: number; change: number };
  activeJobs: number;
  totalApplications: number;
  successfulPlacements: number;
  totalRevenueProcessed: { value: number; change: number };
  totalEscrowLocked: { value: number; change: number };
  platformCommissionEarned: { value: number; change: number };
}

export interface MarketplaceHealth {
  jobFillRate: number;
  candidateSatisfaction: number;
  employerSatisfaction: number;
  averageTimeToHire: number;
  avgTimeToSelection: number;
}

export interface AnalyticsData {
  kpis?: KpiData;

  applicationsTrend?: ApplicationsTrendItem[];

  statusDistribution?: StatusDistributionItem[];

  departmentHiring?: DepartmentHiringItem[];

  placementSuccessRate?: number;

  collegeWiseStats?: CollegeStatsItem[];

  jobDistribution?: JobDistributionItem[];

  platformKpis?: PlatformMetrics;

  marketplaceHealth?: MarketplaceHealth;
}
