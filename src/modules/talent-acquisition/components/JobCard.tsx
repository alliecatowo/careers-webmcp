
import { Job, Department, Country } from '@/lib/talent-acquisition';
import { normalizeJob } from '@/domain/jobs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, ChevronsRight, DollarSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type JobCardProps = {
    job: Job;
    departments: Department[];
    countries: Country[];
}

function formatCompact(amount: number): string {
    return `$${Math.round(amount / 1000)}k`;
}

const JobCardComponent = ({ job, departments, countries }: JobCardProps) => {
    const country = countries.find(c => c.id === job.countryId);
    const careersJob = normalizeJob(job, departments, countries);
    const jobUrl = country ? careersJob.url : `/careers/open-positions`;
    const applyUrl = country ? `/careers/application/${country.slug}?jobId=${job.id}` : `/careers/open-positions`;
    const compensationLabel = careersJob.compensation
        ? `${formatCompact(careersJob.compensation.min)}–${formatCompact(careersJob.compensation.max)}`
        : null;

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 group" data-testid="job-card" data-job-id={job.id}>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Link href={jobUrl} className="text-xl font-bold text-primary hover:underline">{job.title}</Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span>{careersJob.department} · {careersJob.team}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{careersJob.location}</span></div>
                            <div className="flex items-center gap-2"><ChevronsRight className="h-4 w-4" /><span>{careersJob.level}</span></div>
                            {compensationLabel && (
                                <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" /><span>{compensationLabel}</span></div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                            {job.isNew && <Badge variant="outline" className="border-blue-500 text-blue-500">New</Badge>}
                            <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20">{careersJob.workplace}</Badge>
                             <Badge variant="secondary" className="border-transparent">{job.employmentType}</Badge>
                        </div>
                         <Button asChild className="w-full md:w-auto">
                            <Link href={applyUrl}>Apply Now</Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export const JobCard = React.memo(JobCardComponent);
