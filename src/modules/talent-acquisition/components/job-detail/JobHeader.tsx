
import { Badge } from "@/components/ui/badge";
import { Job, Country } from "@/lib/talent-acquisition";
import { Briefcase, MapPin, Building2, ChevronsRight } from "lucide-react";
import { ApplyCTA } from "./ApplyCTA";

interface JobHeaderProps {
    job: Job;
    country: Country;
    departmentName?: string;
    applyUrl: string;
}

export function JobHeader({ job, country, departmentName, applyUrl }: JobHeaderProps) {
    const level = job.seniorityLevel ?? job.experienceBand;
    const workplace = job.workforceType === 'Onsite' ? 'On-site' : job.workforceType;

    return (
        <section className="bg-muted/40 border-b">
            <div className="container mx-auto py-16 text-center">
                {job.isNew && <Badge variant="outline" className="mb-4 border-primary text-primary">New Posting</Badge>}
                <h1 data-testid="job-title" className="text-4xl md:text-6xl font-bold tracking-tight">{job.title}</h1>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-lg text-muted-foreground">
                    {departmentName && <div className="flex items-center gap-2"><Briefcase className="h-5 w-5"/>{departmentName}{job.team ? ` · ${job.team}` : ''}</div>}
                    <div className="flex items-center gap-2"><MapPin className="h-5 w-5"/>{job.city}, {country.name}</div>
                    {level && <div className="flex items-center gap-2"><ChevronsRight className="h-5 w-5"/>{level}</div>}
                    <div className="flex items-center gap-2"><Building2 className="h-5 w-5"/>{workplace}</div>
                </div>
                 <div className="mt-8">
                   <ApplyCTA applyUrl={applyUrl} />
                </div>
            </div>
        </section>
    );
}
