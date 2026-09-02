
import { AnalyticsData, AnalyticsFilters, KpiData } from '@/modules/analytics/domain/analytics.entity';
import { AnalyticsService } from '@/modules/analytics/services/analytics.service';
import { mockJobs as allMockJobs } from '@/mocks/talent-platform/jobs.mock';
import { mockDepartments } from '@/mocks/talent-platform/departments.mock';
import { mockApplications } from '@/mocks/applications.mock';
import { subMonths, isWithinInterval, startOfMonth, format, differenceInDays } from 'date-fns';
import { JobStatus } from '@/lib/talent-acquisition';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const generateAnalyticsData = (filters: AnalyticsFilters, tenantId: string): AnalyticsData => {
    const filteredJobs = allMockJobs.filter(job => {
        if(job.tenantId !== tenantId) return false;

        const jobDate = new Date(job.createdAt);
        const inDateRange = filters.dateRange?.from && filters.dateRange?.to
            ? isWithinInterval(jobDate, { start: filters.dateRange.from, end: filters.dateRange.to })
            : true;

        const inCountry = filters.countries && filters.countries.length > 0
            ? filters.countries.includes(job.countryId)
            : true;
            
        const inDepartment = filters.departmentIds && filters.departmentIds.length > 0
            ? filters.departmentIds.includes(job.departmentId)
            : true;

        return inDateRange && inCountry && inDepartment;
    });
    
    const filteredJobIds = new Set(filteredJobs.map(j => j.id));
    const filteredApplications = mockApplications.filter(app => filteredJobIds.has(app.jobId));


    // 2. Calculate KPIs
    const totalActiveJobs = filteredJobs.filter(j => j.status === 'published').length;
    const totalApplications = filteredApplications.length;
    const totalViews = filteredJobs.reduce((sum, j) => sum + ((j as any).views || 0), 1);
    const overallConversionRate = totalViews > 0 ? Math.round((totalApplications / totalViews) * 100) : 0;

    const filledJobs = filteredJobs.filter(j => j.status === 'closed' || j.status === 'archived');
    const totalTimeToFill = filledJobs.reduce((sum, j) => {
        if ((j as any).closeDate) {
            return sum + differenceInDays(new Date((j as any).closeDate), new Date(j.createdAt));
        }
        return sum;
    }, 0);
    const avgTimeToFill = filledJobs.length > 0 ? Math.round(totalTimeToFill / filledJobs.length) : 0;
    
    const kpis: KpiData = {
        totalActiveJobs: { value: totalActiveJobs, change: Math.random() * 10 - 5 },
        totalApplications: { value: totalApplications, change: Math.random() * 20 - 10 },
        avgTimeToFill: { value: avgTimeToFill, change: Math.random() * -5 },
        overallConversionRate: { value: overallConversionRate, change: Math.random() * 2 - 1 },
    };

    // 3. Calculate Chart Data
    const applicationsTrendMap = new Map<string, number>();
    const months = Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(new Date(), 5 - i)));
    
    months.forEach(month => {
        const monthKey = format(month, 'MMM yyyy');
        applicationsTrendMap.set(monthKey, 0);
    });

    filteredJobs.forEach(job => {
        const monthKey = format(startOfMonth(new Date(job.createdAt)), 'MMM yyyy');
        if(applicationsTrendMap.has(monthKey)) {
            applicationsTrendMap.set(monthKey, applicationsTrendMap.get(monthKey)! + (job.applicants || 0));
        }
    });
    
    const applicationsTrend = Array.from(applicationsTrendMap.entries()).map(([date, applications]) => ({ date, applications }));

    const statusDistributionMap = new Map<JobStatus, number>();
    filteredJobs.forEach(job => {
        statusDistributionMap.set(job.status, (statusDistributionMap.get(job.status) || 0) + 1);
    });
    
    const statusColors: Record<JobStatus, string> = {
        draft: 'hsl(var(--chart-1))',
        published: 'hsl(var(--chart-2))',
        closed: 'hsl(var(--chart-3))',
        archived: 'hsl(var(--chart-4))',
        approved: 'hsl(var(--chart-5))',
        'internal-review': 'hsl(var(--chart-1))',
        'compliance-review': 'hsl(var(--chart-2))',
        scheduled: 'hsl(var(--chart-3))',
        paused: 'hsl(var(--chart-4))'
    };
    const statusDistribution = Array.from(statusDistributionMap.entries()).map(([status, count]) => ({
        name: status,
        value: count,
        fill: statusColors[status] || 'hsl(var(--muted))'
    }));

    const deptMap = new Map(mockDepartments.map(d => [d.id, d.name]));
    const departmentHiring = filteredJobs.reduce((acc, job) => {
        const deptName = deptMap.get(job.departmentId) || 'Unknown';
        if (job.status === 'closed' || job.status === 'archived') {
            acc[deptName] = (acc[deptName] || 0) + 1; // Assuming 1 hire per closed job for mock
        }
        return acc;
    }, {} as Record<string, number>);
    
    return {
        kpis,
        applicationsTrend,
        statusDistribution,
        departmentHiring: Object.entries(departmentHiring).map(([department, hires]) => ({ department, hires })),
    };
};

export const analyticsMockService: AnalyticsService = {
  async getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsData> {
    await delay(800);
    const tenantId = typeof window !== 'undefined' ? localStorage.getItem('talent-os-tenant-id') : 'org_acme';
    return generateAnalyticsData(filters, tenantId || 'org_acme');
  },
};
