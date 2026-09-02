'use client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserForm } from "@/features/users/components/UserForm";
import { SystemUser } from '../domain/user.entity';

interface UserFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: SystemUser | null;
    onSaveSuccess: () => void;
}

export function UserFormDrawer({ isOpen, onClose, user, onSaveSuccess }: UserFormDrawerProps) {
    const isEditMode = !!user;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{isEditMode ? "Edit User" : "Create New User"}</SheetTitle>
                    <SheetDescription>
                        {isEditMode ? "Update the user's details and role." : "Fill out the form to add a new user to the system."}
                    </SheetDescription>
                </SheetHeader>
                <div className="py-8">
                    <UserForm
                        existingUser={user}
                        onSaveSuccess={onSaveSuccess}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
