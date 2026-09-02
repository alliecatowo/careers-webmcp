'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/components/system/Toast/useToast';
import { useRequest } from '@/lib/request/useRequest';
import { TeamMember } from '@/lib/team.data';
import { teamService } from '@/services/team.service';
import { TeamTable } from '@/modules/team/components/TeamTable';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RouteGuard } from '@/components/system/RouteGuard';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AccessGuard } from '@/components/system/AccessGuard';

const TeamMemberFormDrawer = dynamic(
  () =>
    import('@/modules/team/components/TeamMemberFormDrawer').then(
      (mod) => mod.TeamMemberFormDrawer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  },
);

function MobileTeamMemberCard({
  member,
  onEdit,
  onDelete,
}: {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.image} alt={member.name} />
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">{member.name}</CardTitle>
            <CardDescription>{member.role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {member.tagline}
      </CardContent>
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <MoreHorizontal className="h-4 w-4 mr-2" /> Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => onEdit(member)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AccessGuard permission="users.manage" resource={member}>
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => onDelete(member)}
              >
                Delete
              </DropdownMenuItem>
            </AccessGuard>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

export default function TeamManagementPage() {
  const { showToast } = useToast();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  const {
    data: members,
    isLoading,
    execute: fetchMembers,
    error,
  } = useRequest(teamService.getTeamMembers);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const { run: deleteMember, isLoading: isDeleting } = useAsyncAction(
    async (id: string) => {
      await teamService.deleteTeamMember(id);
    },
    {
      onSuccess: () => {
        showToast({
          type: 'success',
          title: 'Member Deleted',
          description: `${deletingMember?.name} has been removed from the team.`,
        });
        fetchMembers();
        setIsDeleteDialogOpen(false);
        setDeletingMember(null);
      },
    },
  );

  const handleCreate = () => {
    setEditingMember(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsDrawerOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsDrawerOpen(false);
    fetchMembers();
    showToast({
      type: 'success',
      title: 'Success',
      description: `Team member has been successfully ${
        editingMember ? 'updated' : 'created'
      }.`,
    });
  };

  const openDeleteDialog = (member: TeamMember) => {
    setDeletingMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingMember) {
      deleteMember(deletingMember.id);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-destructive py-8 border rounded-lg">
          <p>Failed to load team members: {error.message}</p>
        </div>
      );
    }
    if (members) {
      return (
        <>
          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
            {members.map((member) => (
              <MobileTeamMemberCard
                key={member.id}
                member={member}
                onEdit={handleEdit}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <TeamTable
              members={members}
              onEdit={handleEdit}
              onDelete={openDeleteDialog}
            />
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the team member{' '}
                  <span className="font-bold">{deletingMember?.name}</span>.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    }
    return null;
  };

  return (
    <RouteGuard permission="users.manage">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Team Management
            </h1>
            <p className="text-muted-foreground">
              Add, edit, or remove members from the public "Meet the Team" page.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <PlusCircle />
            Add Member
          </Button>
        </div>

        {renderContent()}

        {isDrawerOpen && (
          <TeamMemberFormDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            member={editingMember}
            onSaveSuccess={handleSaveSuccess}
          />
        )}
      </div>
    </RouteGuard>
  );
}
