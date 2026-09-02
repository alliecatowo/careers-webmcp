
'use client';
import { useParams } from 'next/navigation';
import { useRequest } from '@/lib/request/useRequest';
import { projectService, milestoneService } from '@/services/service';
import { Skeleton } from '@/components/ui/skeleton';
import { MilestoneList } from '@/modules/milestones/components/MilestoneList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { SubmitReviewDialog } from '@/modules/reviews/components/SubmitReviewDialog';
import useSWR from 'swr';

export default function ContractorProjectDetailPage() {
    const params = useParams();
    const projectId = params.projectId as string;
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const { data: project, isLoading: projectLoading, mutate: refreshProject } = useSWR(projectId ? `project-${projectId}` : null, () => projectService.getById(projectId).then(res => res.data));
    const { data: milestonesResponse, isLoading: milestonesLoading, mutate: refreshMilestones } = useSWR('allMilestones', () => milestoneService.getAll());

    const milestones = milestonesResponse?.data?.data.filter(m => m.projectId === projectId) || [];
    const isLoading = projectLoading || milestonesLoading;
    
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
    
    const canReview = project.status === 'COMPLETED';

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
                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                     <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="milestones" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Milestones</CardTitle>
                            <CardDescription>Submit your work and track payment status.</CardDescription>
                        </CardHeader>
                         <CardContent>
                             <MilestoneList 
                                milestones={milestones} 
                                role="CONTRACTOR"
                                onUpdate={refreshMilestones}
                            />
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
                        refreshProject();
                    }}
                    projectId={project.id}
                    revieweeId={project.clientId}
                />
            )}
        </div>
    );
}
