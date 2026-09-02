
'use client';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from 'lucide-react';
import { JobForm } from "@/modules/jobs/components/JobForm";
import { useAuth } from "@/hooks/useAuth";
import { talentService } from '@/services/talent.service';
import { Job } from '@/lib/talent-acquisition';

interface JobFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    jobId?: string | null;
    onSaveSuccess: () => void;
}

export function JobFormDrawer({ isOpen, onClose, jobId, onSaveSuccess }: JobFormDrawerProps) {
    const { user } = useAuth();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const isEditMode = !!jobId;

    useEffect(() => {
        const fetchJob = async () => {
            if (jobId && isOpen) {
                setIsLoading(true);
                try {
                    const data = await talentService.getJobById(jobId);
                    if (data) {
                        setJob(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch job:", error);
                    setJob(null);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setJob(null);
            }
        };
        fetchJob();
    }, [jobId, isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEditMode ? "Edit Job" : "Create New Job"}</SheetTitle>
                    <SheetDescription>
                        {isEditMode ? "Update the details of the existing job posting." : "Fill out the form to create a new job posting."}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8">
                     {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                     ) : (isEditMode && !job) ? (
                        <p className="text-center text-destructive">Failed to load job data.</p>
                     ) : (
                        user && <JobForm
                            user={user}
                            existingJob={job}
                            onSaveSuccess={onSaveSuccess}
                        />
                     )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
