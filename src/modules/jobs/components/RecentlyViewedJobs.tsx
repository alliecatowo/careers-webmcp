'use client';

import { useState, useEffect } from 'react';
import { Job, Department, Country } from '@/lib/talent-acquisition';
import { talentService } from '@/services/talent.service';
import { JobCard } from '@/modules/talent-acquisition/components/JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RECENTLY_VIEWED_KEY = 'recentlyViewedJobs';

function RecentlyViewedSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
    );
}

export function RecentlyViewedJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [hasViewedJobs, setHasViewedJobs] = useState(false);

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            setIsLoading(true);
            try {
                const storedValue = localStorage.getItem(RECENTLY_VIEWED_KEY);
                if (storedValue) {
                    const jobIds: string[] = JSON.parse(storedValue);
                    if (jobIds.length > 0) {
                        setHasViewedJobs(true);
                        const [fetchedJobs, fetchedDepts, fetchedCountries] = await Promise.all([
                            Promise.all(jobIds.map(id => talentService.getJobById(id))),
                            talentService.getDepartments({}),
                            talentService.getCountries({})
                        ]);

                        setJobs(fetchedJobs.filter((job): job is Job => !!job));
                        setDepartments(fetchedDepts);
                        setCountries(fetchedCountries);
                    } else {
                        setHasViewedJobs(false);
                    }
                } else {
                    setHasViewedJobs(false);
                }
            } catch (error) {
                console.error("Failed to fetch recently viewed jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Ensure this runs only client-side
        if (typeof window !== 'undefined') {
            fetchRecentlyViewed();
        }
    }, []);

    if (isLoading) {
        return <RecentlyViewedSkeleton />;
    }

    if (!hasViewedJobs) {
        return null; // Don't render the component if there are no recently viewed jobs
    }

    return (
        <Card className="mt-12 bg-muted/40">
            <CardHeader>
                <CardTitle>Recently Viewed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
                {jobs.length > 0 ? (
                    <div className="space-y-6">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} departments={departments} countries={countries} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Your recently viewed jobs will appear here.</p>
                )}
            </CardContent>
        </Card>
    );
}
