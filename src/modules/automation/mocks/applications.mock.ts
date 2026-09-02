
import { Application } from '@/types';

export const mockApplicationsForAutomation: Application[] = [
    // Application for job that will be closed, should be updated
    {
        id: 'auto-app-1',
        jobId: 'auto-job-2',
        candidateId: 'cand-1',
        status: 'APPLIED',
        createdAt: new Date(),
    },
    // Another application for the same job, different status (should not be updated)
    {
        id: 'auto-app-2',
        jobId: 'auto-job-2',
        candidateId: 'cand-2',
        status: 'SCREENED',
        createdAt: new Date(),
    },
    // Application for the high-volume job
    {
        id: 'auto-app-3',
        jobId: 'auto-job-3',
        candidateId: 'cand-3',
        status: 'APPLIED',
        createdAt: new Date(),
    },
     // ... add 197 more
    ...Array.from({ length: 197 }, (_, i) => ({
        id: `auto-app-filler-${i}`,
        jobId: `auto-job-filler-${i % 45}`,
        candidateId: `cand-filler-${i}`,
        status: (i % 3 === 0 ? 'APPLIED' : 'SCREENED') as "APPLIED" | "SCREENED",
        createdAt: new Date(),
    }))
];
