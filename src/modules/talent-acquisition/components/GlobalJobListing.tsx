
'use client';

import { Suspense } from 'react';
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
import { JobCard } from './JobCard';
import { PaginationControls } from '@/modules/jobs/components/PaginationControls';

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
                <Input 
                    placeholder="Search by title or keyword..."
                    defaultValue={searchParams.get('q') || ''}
                    onChange={(e) => debouncedHandleFilterChange('q', e.target.value)}
                    className="pl-10"
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
        </div>
    );
}

function JobListings({ countries, departments }: { countries: Country[], departments: Department[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = Number(searchParams.get('page')) || 1;
    const limit = 5; // Set a limit for public pagination

    const filters: any = {
        status: 'published',
        q: searchParams.get('q') || undefined,
        countryId: searchParams.get('countryId') || undefined,
        departmentId: searchParams.get('departmentId') || undefined,
        employmentType: searchParams.get('employmentType') || undefined,
        page,
        limit,
    };
    
    // Remove undefined filters before stringifying
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    const { data: jobsResponse, error, isLoading } = useSWR(
        ['public-jobs', JSON.stringify(filters)],
        () => talentService.getJobs(filters)
    );

    const setPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.push(`${pathname}?${params.toString()}`, { scroll: true });
    };

    if (isLoading) return <LoadingSkeleton />;
    if (error) return <Card><CardContent className="p-6 text-destructive">Failed to load jobs. Please try again later.</CardContent></Card>;

    const jobs = jobsResponse?.data || [];
    const totalJobs = jobsResponse?.total || 0;

    return (
        <div className="space-y-8">
            <h2 className="text-xl font-semibold tracking-tight">{totalJobs} open position{totalJobs === 1 ? '' : 's'}</h2>
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
            {jobsResponse && jobsResponse.totalPages > 1 && (
                <PaginationControls 
                    page={page}
                    setPage={setPage}
                    totalPages={jobsResponse.totalPages}
                    totalItems={jobsResponse.total}
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
