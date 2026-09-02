
import { Job, Department, Country } from '@/lib/talent-acquisition';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type JobCardProps = {
    job: Job;
    departments: Department[];
    countries: Country[];
}

const JobCardComponent = ({ job, departments, countries }: JobCardProps) => {
    const department = departments.find(d => d.id === job.departmentId)?.name || 'Unknown Department';
    const country = countries.find(c => c.id === job.countryId);
    const location = job.workforceType === 'Remote' ? 'Remote' : `${job.city}, ${country?.name || 'Unknown'}`;
    const jobUrl = country ? `/careers/countries/${country.slug}/jobs/${job.id}` : `/careers/open-positions`;
    const applyUrl = country ? `/careers/application/${country.slug}?jobId=${job.id}` : `/careers/open-positions`;

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 group">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Link href={jobUrl} className="text-xl font-bold text-primary hover:underline">{job.title}</Link>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4" /><span>{department}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{location}</span></div>
                            <div className="flex items-center gap-2"><ChevronsRight className="h-4 w-4" /><span>{job.experienceBand}</span></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start md:items-end justify-between gap-4">
                        <div className="flex items-center gap-2">
                            {job.isNew && <Badge variant="outline" className="border-blue-500 text-blue-500">New</Badge>}
                            {job.workforceType === 'Remote' && <Badge variant="outline" className="border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20">🌍 Remote</Badge>}
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
