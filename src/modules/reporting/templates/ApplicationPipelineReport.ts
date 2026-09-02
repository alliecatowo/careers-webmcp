import { ApplicationPipelineData } from '../types';
import { Application, Job } from '@/lib/talent-acquisition';
import { differenceInDays } from 'date-fns';

export class ApplicationPipelineReport {
    static build(applications: Application[], jobs: Job[]): ApplicationPipelineData[] {
        const jobMap = new Map(jobs.map(j => [j.id, j]));

        return applications.map(app => {
            const job = jobMap.get(app.jobId);
            const daysInStage = differenceInDays(new Date(), new Date((app as any).updatedAt || app.createdAt));

            return {
                applicationId: app.id,
                jobTitle: job?.title || 'Unknown Job',
                country: job?.countryId || 'Unknown',
                applicantName: (app as any).candidateName || 'Unknown Applicant',
                status: app.status,
                submittedDate: new Date(app.createdAt).toLocaleDateString(),
                daysInStage,
            };
        });
    }
}
