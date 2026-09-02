'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CandidateForm } from "./CandidateForm";
import { Candidate } from '../candidates.types';

interface CandidateFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    candidateId: string | null;
    onSaveSuccess: () => void;
}

export function CandidateFormDrawer({ isOpen, onClose, candidateId, onSaveSuccess }: CandidateFormDrawerProps) {
    const isEditMode = !!candidateId;
    // In a real app, you would fetch the candidate data here if in edit mode.
    const existingCandidate: Candidate | null = null; 

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEditMode ? "Edit Candidate" : "Add New Candidate"}</SheetTitle>
                    <SheetDescription>
                        {isEditMode ? "Update the candidate's details." : "Fill out the form to add a new candidate."}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8">
                    <CandidateForm
                        existingCandidate={existingCandidate}
                        onSaveSuccess={onSaveSuccess}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
