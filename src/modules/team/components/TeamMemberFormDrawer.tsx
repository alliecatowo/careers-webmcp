'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TeamMemberForm } from "./TeamMemberForm";
import { TeamMember } from "@/lib/team.data";

interface TeamMemberFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    member: TeamMember | null;
    onSaveSuccess: () => void;
}

export function TeamMemberFormDrawer({ isOpen, onClose, member, onSaveSuccess }: TeamMemberFormDrawerProps) {
    const isEditMode = !!member;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEditMode ? "Edit Team Member" : "Add New Team Member"}</SheetTitle>
                    <SheetDescription>
                        {isEditMode ? "Update the member's public profile." : "Fill out the form to add a new member to the team page."}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8">
                    <TeamMemberForm
                        existingMember={member}
                        onSaveSuccess={onSaveSuccess}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
