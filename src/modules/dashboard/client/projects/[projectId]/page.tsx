
'use client';
import { useParams } from 'next/navigation';
import { useRequest } from '@/lib/request/useRequest';
import { projectService, milestoneService, rankingService } from '@/services/service';
import { Skeleton } from '@/components/ui/skeleton';
import { MilestoneList } from '@/modules/milestones/components/MilestoneList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RankedApplicationList } from '@/modules/projects/components/RankedApplicationList';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SubmitReviewDialog } from '@/modules/reviews/components/SubmitReviewDialog';

export default function ClientProjectDetailPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const { data: projectResponse, isLoading: projectLoading, execute: refreshProject } = useRequest(() => projectService.getById(projectId), [projectId]);
    const { data: milestonesResponse, isLoading: milestonesLoading, execute: refreshMilestones } = useRequest(() => milestoneService.getAll(), []); // MOCK: fetch by project
    const { data: applicationsResponse, isLoading: applicationsLoading, execute: refreshApplications } = useRequest(() => rankingService.getRankedApplications(projectId), [projectId]);

    const project = projectResponse?.data;
    const milestones = milestonesResponse?.data?.data.filter(m => m.projectId === projectId) || [];
    const applications = applicationsResponse?.data || [];
    const isLoading = projectLoading || milestonesLoading || applicationsLoading;

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!project) return <p>Project not found.</p>;

    const canReview = project.status === 'COMPLETED' && project.assignedContractorId;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                    <p className="text-muted-foreground">{project.description}</p>
                </div>
                {canReview && (
                    <Button onClick={() => setIsReviewOpen(true)}>Leave a Review</Button>
                )}
            </div>

            <Tabs defaultValue="milestones">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                </TabsList>
                <TabsContent value="milestones" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Milestones</CardTitle>
                            <CardDescription>Fund, review, and approve project milestones.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4 mb-8">
                                {project.status !== 'COMPLETED' && (
                                    <Button>Complete Project</Button>
                                )}
                            </div>
                            <MilestoneList
                                milestones={milestones}
                                role="CLIENT"
                                onUpdate={refreshMilestones}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="applications" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Applicants</CardTitle>
                            <CardDescription>Review, rank, and select the best contractor for your project.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RankedApplicationList applications={applications} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            {isReviewOpen && canReview && (
                <SubmitReviewDialog
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    onSuccess={() => {
                        setIsReviewOpen(false);
                        refreshProject(); // To potentially hide the review button
                    }}
                    projectId={project.id}
                    revieweeId={project.assignedContractorId!}
                />
            )}
        </div>
    );
}
