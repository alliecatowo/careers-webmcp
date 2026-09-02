'use client';

import { useState, useEffect } from 'react';
import { User, Application } from "@/types";
import { ApplicationList } from "../application-list";
import { applicationService } from "@/services/application.service";
import { talentService } from "@/services/talent.service";
import { Skeleton } from '@/components/ui/skeleton';

interface ApplicationsTabProps {
    user: User;
}

interface ApplicationWithJobTitle extends Application {
    jobTitle: string;
}

export function ApplicationsTab({ user }: ApplicationsTabProps) {
    const [applications, setApplications] = useState<ApplicationWithJobTitle[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!user?.id) return;
            setIsLoading(true);
            try {
                const [userApplications, jobs] = await Promise.all([
                    applicationService.getApplicationsForUser(user.id),
                    talentService.getJobs({}),
                ]);

                const jobsMap = new Map(jobs.data.map(job => [job.id, job.title]));
                const augmentedApplications = userApplications.map(app => ({
                    ...app,
                    jobTitle: jobsMap.get(app.jobId) || 'Unknown Job',
                }));

                setApplications(augmentedApplications);
            } catch (err) {
                console.error("Failed to fetch applications data:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user.id]);

    if (isLoading) {
        return <Skeleton className="h-48 w-full" />;
    }

    return <ApplicationList applications={applications} />;
}
