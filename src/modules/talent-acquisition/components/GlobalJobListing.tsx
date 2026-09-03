
'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { Job, Country, Department } from '@/lib/talent-acquisition';
import { talentService } from '@/services/talent.service';
import { JOB_LEVELS, filterAndRankJobs } from '@/domain/jobs';
import { normalizeJob } from '@/domain/jobs/normalize';
import { JobCard } from './JobCard';
import { PaginationControls } from '@/modules/jobs/components/PaginationControls';
import { AgentSearchInput } from './AgentSearchInput';
import { ExportResultsButton } from './ExportResultsButton';

const WORKPLACES = ['On-site', 'Hybrid', 'Remote'] as const;

type GlobalJobListingProps = {
    countries: Country[];
    departments: Department[];
};

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
    );
}

function JobFilters({ countries, departments }: { countries: Country[], departments: Department[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    
    const experienceLevels = ['Intern', 'Entry', 'Mid', 'Senior', 'Lead', 'Principal'];
    const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1'); // Reset to first page
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };
    
    const debouncedHandleFilterChange = useDebouncedCallback(handleFilterChange, 300);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="relative md:col-span-2 lg:col-span-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <AgentSearchInput
                    urlQuery={searchParams.get('q') || ''}
                    onQueryChange={(value) => debouncedHandleFilterChange('q', value)}
                />
            </div>
             <Select defaultValue={searchParams.get('countryId') || 'all'} onValueChange={(v) => handleFilterChange('countryId', v)}>
                <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select defaultValue={searchParams.get('departmentId') || 'all'} onValueChange={(v) => handleFilterChange('departmentId', v)}>
                <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select defaultValue={searchParams.get('employmentType') || 'all'} onValueChange={(v) => handleFilterChange('employmentType', v)}>
                <SelectTrigger><SelectValue placeholder="Job Type" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Job Types</SelectItem>
                    {jobTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select defaultValue={searchParams.get('level') || 'all'} onValueChange={(v) => handleFilterChange('level', v)}>
                <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {JOB_LEVELS.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select defaultValue={searchParams.get('workplace') || 'all'} onValueChange={(v) => handleFilterChange('workplace', v)}>
                <SelectTrigger><SelectValue placeholder="Workplace" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Workplaces</SelectItem>
                    {WORKPLACES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    );
}

function JobListings({ countries, departments }: { countries: Country[], departments: Department[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = Number(searchParams.get('page')) || 1;
    const limit = 10; // Set a limit for public pagination
    const level = searchParams.get('level') || undefined;
    const workplace = searchParams.get('workplace') || undefined;

    // Adapter-side filters are the ones the backend understands. The free-text
    // query, level and workplace are resolved locally through the SAME
    // deterministic scorer careers_search_jobs uses, so the agent and the human
    // never disagree about what matches (BUILD_CONTRACT §11).
    const baseFilters: any = {
        status: 'published',
        countryId: searchParams.get('countryId') || undefined,
        departmentId: searchParams.get('departmentId') || undefined,
        employmentType: searchParams.get('employmentType') || undefined,
        limit: 100,
    };
    Object.keys(baseFilters).forEach(key => baseFilters[key] === undefined && delete baseFilters[key]);

    const { data: jobsResponse, error, isLoading } = useSWR(
        ['public-jobs', JSON.stringify(baseFilters)],
        () => talentService.getJobs(baseFilters)
    );

    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.push(`${pathname}?${params.toString()}`, { scroll: true });
    };

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <Card><CardContent className="p-6 text-destructive">Failed to load jobs. Please try again later.</CardContent></Card>;

    const allJobs = jobsResponse?.data || [];
    const query = searchParams.get('q') || undefined;
    const ranked = filterAndRankJobs(
        allJobs.map(job => normalizeJob(job, departments, countries)),
        {
            query,
            levels: level ? [level] : undefined,
            workplace: workplace ? [workplace] : undefined,
        },
    );
    // Render the upstream Job objects JobCard expects, in the ranked order.
    const byId = new Map(allJobs.map(job => [job.id, job]));
    const filteredJobs = ranked
        .map(job => byId.get(job.id))
        .filter((job): job is NonNullable<typeof job> => !!job);
    const totalJobs = filteredJobs.length;
    const totalPages = Math.max(1, Math.ceil(totalJobs / limit));
    const jobs = filteredJobs.slice((page - 1) * limit, page * limit);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">{totalJobs} open position{totalJobs === 1 ? '' : 's'}</h2>
                <ExportResultsButton jobs={filteredJobs} departments={departments} countries={countries} />
            </div>
            {jobs.length > 0 ? (
                <div className="space-y-6">
                    {jobs.map(job => (
                        <JobCard key={job.id} job={job} departments={departments} countries={countries} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <h3 className="text-xl font-semibold">No Matching Positions Found</h3>
                        <p className="mt-2 text-muted-foreground">Please try adjusting your search filters.</p>
                    </CardContent>
                </Card>
            )}
            {totalPages > 1 && (
                <PaginationControls
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    totalItems={totalJobs}
                    itemsCount={jobs.length}
                    limit={limit}
                />
            )}
        </div>
    );
}

export function GlobalJobListing(props: GlobalJobListingProps) {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
             <div className="space-y-8">
                <JobFilters {...props} />
                <JobListings {...props} />
            </div>
        </Suspense>
    );
}
