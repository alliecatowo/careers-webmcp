
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { RouteGuard } from '@/components/system/RouteGuard';
import { useInterviews } from '@/modules/interviews/hooks/useInterviews';
import { InterviewsTable } from '@/modules/interviews/components/InterviewsTable';
import { interviewService } from '@/services/interview.service';
import { useToast } from '@/components/system/Toast/useToast';
import { Interview, InterviewStatus } from '@/modules/interviews/domain/interview.entity';

const InterviewFormDrawer = dynamic(() => import('@/modules/interviews/components/InterviewFormDrawer').then(mod => mod.InterviewFormDrawer), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
});

export default function InterviewsPage() {
    const { interviews, isLoading, mutate } = useInterviews();
    const { showToast } = useToast();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleStatusUpdate = async (interviewId: string, status: InterviewStatus) => {
        try {
            await interviewService.updateStatus(interviewId, status);
            showToast({
                type: 'success',
                title: "Interview Updated",
                description: `The interview has been marked as ${status.toLowerCase()}.`
            });
            mutate(); // Re-fetch the data to update the UI
        } catch (error) {
            showToast({
                type: 'error',
                title: "Update Failed",
                description: "Could not update the interview status."
            });
        }
    };
    
    const handleSaveSuccess = () => {
        setIsDrawerOpen(false);
        showToast({
            type: 'success',
            title: "Interview Scheduled",
            description: "The interview has been added to the calendar."
        });
        mutate();
    };

    return (
        <RouteGuard permission='interviews.schedule'>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Interview Management</h1>
                        <p className="text-muted-foreground">
                            Review, schedule, and manage all candidate interviews.
                        </p>
                    </div>
                    <Button onClick={() => setIsDrawerOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Schedule Interview
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <InterviewsTable
                        interviews={interviews || []}
                        onStatusChange={handleStatusUpdate}
                    />
                )}
            </div>

            {isDrawerOpen && (
                 <InterviewFormDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </RouteGuard>
    );
}
