import { CountryHiringData } from '../types';
import { Application, Job } from '@/lib/talent-acquisition';
import { differenceInDays } from 'date-fns';

export class CountryHiringReport {
    static build(jobs: Job[], applications: Application[]): CountryHiringData[] {
        const countryData: { [key: string]: Omit<CountryHiringData, 'country' | 'avgTimeToFill' | 'conversionRate'> & { fillTimes: number[], totalViews: number } } = {};

        jobs.forEach(job => {
            if (!countryData[job.countryId]) {
                countryData[job.countryId] = { totalJobs: 0, activeJobs: 0, closedJobs: 0, totalApplications: 0, fillTimes: [], totalViews: 0 };
            }
            const country = countryData[job.countryId];
            country.totalJobs++;
            if (job.status === 'published') country.activeJobs++;
            if (job.status === 'closed' || job.status === 'archived') country.closedJobs++;

            const timeToFill = (job as any).closeDate ? differenceInDays(new Date((job as any).closeDate), new Date(job.createdAt)) : null;
            if (timeToFill !== null && timeToFill > 0) {
                country.fillTimes.push(timeToFill);
            }
            country.totalViews += (job as any).views || 0;
        });

        applications.forEach(app => {
            const job = jobs.find(j => j.id === app.jobId);
            if (job && countryData[job.countryId]) {
                countryData[job.countryId].totalApplications++;
            }
        });

        return Object.entries(countryData).map(([country, data]) => {
            const avgTimeToFill = data.fillTimes.length > 0 ? Math.round(data.fillTimes.reduce((a, b) => a + b, 0) / data.fillTimes.length) : 0;
            const conversionRate = data.totalViews > 0 ? ((data.totalApplications / data.totalViews) * 100).toFixed(2) + '%' : '0.00%';
            return {
                country,
                ...data,
                avgTimeToFill,
                conversionRate,
            };
        });
    }
}
