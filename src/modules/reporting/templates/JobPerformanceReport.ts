import { JobPerformanceData } from '../types';
import { Job } from '@/lib/talent-acquisition';
import { differenceInDays } from 'date-fns';

export class JobPerformanceReport {
    static build(jobs: Job[]): JobPerformanceData[] {
        return jobs.map(job => {
            const views = (job as any).views || 0;
            const applicants = (job as any).applicants || 0;
            const conversionRate = views > 0 ? ((applicants / views) * 100).toFixed(2) + '%' : '0.00%';
            
            let timeToFill: number | undefined;
            if ((job.status === 'closed' || job.status === 'archived') && job.createdAt && (job as any).closeDate) {
                const diff = differenceInDays(new Date((job as any).closeDate), new Date(job.createdAt));
                timeToFill = diff > 0 ? diff : 0;
            }
            
            return {
                jobId: job.id,
                title: job.title,
                country: job.countryId, // This can be mapped to a name in the UI
                department: job.departmentId, // Mapped to name
                publishDate: job.publishStartDate ? new Date(job.publishStartDate).toLocaleDateString() : 'N/A',
                closeDate: (job as any).closeDate ? new Date((job as any).closeDate).toLocaleDateString() : 'N/A',
                views,
                applicants,
                conversionRate,
                timeToFill
            };
        });
    }
}
