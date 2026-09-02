'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { InterviewForm } from "./InterviewForm";

interface InterviewFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export function InterviewFormDrawer({ isOpen, onClose, onSaveSuccess }: InterviewFormDrawerProps) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Schedule New Interview</SheetTitle>
                    <SheetDescription>
                        Select a candidate, job, and interviewer to schedule a new interview.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8">
                    <InterviewForm onSaveSuccess={onSaveSuccess} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
