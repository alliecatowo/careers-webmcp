import { Job, Application } from '@/lib/talent-acquisition';
import { ReportFilters as IReportFilters } from './types';
import { isWithinInterval } from 'date-fns';

export class ReportFilters {
    public apply(jobs: Job[], applications: Application[], filters: IReportFilters, countryScope?: string) {
        let filteredJobs = [...jobs];
        let filteredApplications = [...applications];

        // Apply country scope first (for roles like CountryHR)
        if (countryScope) {
            filteredJobs = filteredJobs.filter(job => job.countryId === countryScope);
        }

        // Apply user-defined filters
        if (filters.country && filters.country.length > 0) {
            filteredJobs = filteredJobs.filter(job => filters.country!.includes(job.countryId));
        }
        if (filters.department && filters.department.length > 0) {
            filteredJobs = filteredJobs.filter(job => filters.department!.includes(job.departmentId));
        }
        if (filters.status && filters.status.length > 0) {
            filteredJobs = filteredJobs.filter(job => filters.status!.includes(job.status));
        }
        if (filters.dateRange) {
            const { from, to } = filters.dateRange;
            filteredJobs = filteredJobs.filter(job => {
                const jobDate = new Date(job.createdAt);
                return isWithinInterval(jobDate, { start: from, end: to });
            });
        }
        
        // Filter applications based on the already-filtered jobs
        const filteredJobIds = new Set(filteredJobs.map(j => j.id));
        filteredApplications = filteredApplications.filter(app => filteredJobIds.has(app.jobId));
        
        return { filteredJobs, filteredApplications };
    }
}
