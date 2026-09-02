
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/lib/talent-acquisition";
import { Building, Clock, Globe, Layers, Zap } from "lucide-react";
import { ApplyCTA } from "./ApplyCTA";
import { SaveJobButton } from "@/components/saved-jobs/SaveJobButton";

interface JobMetaSidebarProps {
    job: Job;
    departmentName?: string;
    countryName: string;
    applyUrl: string;
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 text-muted-foreground">{icon}</div>
            <div>
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
                <p className="text-sm">{value}</p>
            </div>
        </div>
    )
}

export function JobMetaSidebar({ job, departmentName, countryName, applyUrl }: JobMetaSidebarProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3">
                <ApplyCTA applyUrl={applyUrl} className="w-full" />
                <SaveJobButton jobId={job.id} className="w-full" />
            </div>
            <Card>
                <CardHeader><CardTitle>Job Overview</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <MetaRow icon={<Building className="h-4 w-4"/>} label="Department" value={departmentName} />
                    <MetaRow icon={<Layers className="h-4 w-4"/>} label="Level" value={job.seniorityLevel ?? job.experienceBand} />
                    <MetaRow icon={<Zap className="h-4 w-4"/>} label="Employment Type" value={job.employmentType} />
                    <MetaRow icon={<Globe className="h-4 w-4"/>} label="Workforce Model" value={job.workforceType} />
                    <MetaRow icon={<Clock className="h-4 w-4"/>} label="Posted On" value={new Date(job.createdAt).toLocaleDateString()} />
                </CardContent>
            </Card>
        </div>
    );
}
