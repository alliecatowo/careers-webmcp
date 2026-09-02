import { SlaComplianceData } from '../types';
import { Job } from '@/lib/talent-acquisition';
import { differenceInDays } from 'date-fns';

const PENDING_STATUSES: Job['status'][] = ['internal-review', 'compliance-review', 'approved'];

export class SlaComplianceReport {
    static build(jobs: Job[]): SlaComplianceData[] {
        const slaBreachedJobs: SlaComplianceData[] = [];
        const now = new Date();

        jobs.forEach(job => {
            if (PENDING_STATUSES.includes(job.status)) {
                const slaThreshold = job.priority === 'Critical' || job.priority === 'High' ? 1 : 3;
                const daysPending = differenceInDays(now, new Date(job.updatedAt));

                if (daysPending > slaThreshold) {
                    slaBreachedJobs.push({
                        jobId: job.id,
                        title: job.title,
                        status: job.status,
                        daysPending,
                        slaThreshold,
                        isBreached: true,
                        priority: job.priority,
                    });
                }
            }
        });

        return slaBreachedJobs;
    }
}
