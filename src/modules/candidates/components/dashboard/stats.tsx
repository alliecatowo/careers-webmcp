'use client';

import { Application } from "@/types";
import { MetricCard } from "@/modules/dashboard/components/MetricCard";
import { Briefcase, CheckCheck, FileText } from "lucide-react";

interface CandidateStatsProps {
    applications: Application[];
}

export function CandidateStats({ applications }: CandidateStatsProps) {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(app => !['HIRED', 'REJECTED'].includes(app.status)).length;
    const offersReceived = applications.filter(app => app.status === 'OFFER' || app.status === 'HIRED').length;
    
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <MetricCard title="Total Applications" value={totalApplications} icon={<FileText />} />
            <MetricCard title="Active Applications" value={activeApplications} icon={<Briefcase />} />
            <MetricCard title="Offers Received" value={offersReceived} icon={<CheckCheck />} />
        </div>
    );
}
