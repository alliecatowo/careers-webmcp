'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { KanbanBoard } from "@/modules/pipeline/components/KanbanBoard";
import { ApplicationWithCandidate } from "@/types";
import { talentService } from "@/services/talent.service";
import { applicationService } from "@/services/application.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function PipelinePage() {
    const params = useParams();
    const jobId = params.jobId as string;

    const [applications, setApplications] = useState<ApplicationWithCandidate[]>([]);
    const [jobTitle, setJobTitle] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!jobId) return;

        const getJobDataForPipeline = async (id: string) => {
            setIsLoading(true);
            try {
                const job = await talentService.getJobById(id);
                if (!job) {
                    notFound();
                    return;
                }
                setJobTitle(job.title);

                const applicationsResponse = await applicationService.getApplications({ page: 1, limit: 1000, filters: { jobId: id } });
                setApplications(applicationsResponse.data);
            } catch (error) {
                console.error("Failed to fetch pipeline data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        getJobDataForPipeline(jobId);

    }, [jobId]);

    return (
        <div className="flex flex-col gap-8 h-full">
            <div className="flex items-center justify-between">
                <div>
                     <Button variant="ghost" asChild className="mb-2">
                        <Link href="/jobs">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Jobs
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Hiring Pipeline</h1>
                    <p className="text-muted-foreground">
                        {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <>For job: {jobTitle}</>}
                    </p>
                </div>
            </div>
            <div className="flex-1 overflow-x-auto">
                 {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                 ) : (
                    <KanbanBoard initialApplications={applications} jobId={jobId} />
                 )}
            </div>
        </div>
    )
}
