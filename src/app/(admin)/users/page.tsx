
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, MoreHorizontal } from 'lucide-react';
import { UsersTable } from '@/features/users/components/UsersTable';
import { SystemUser } from '@/features/users/domain/user.entity';
import { RouteGuard } from '@/components/system/RouteGuard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/system/Toast/useToast';
import { userService } from '@/services/user.service';
import { useRequest } from '@/lib/request/useRequest';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccessGuard } from '@/components/system/AccessGuard';
import { Badge } from '@/components/ui/badge';

const UserFormDrawer = dynamic(() => import('@/features/users/components/UserFormDrawer').then(mod => mod.UserFormDrawer), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
});

function MobileUserCard({ user, onEdit, onDelete }: { user: SystemUser, onEdit: (user: SystemUser) => void, onDelete: (user: SystemUser) => void }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                         <Avatar className="h-10 w-10">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                    </div>
                    <Badge variant="secondary">{user.role}</Badge>
                </div>
            </CardHeader>
            <CardContent className="text-sm">
                <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
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
                        <DropdownMenuItem onSelect={() => onEdit(user)}>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AccessGuard permission="users.manage" resource={user}>
                            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(user)}>
                                Delete
                            </DropdownMenuItem>
                        </AccessGuard>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}

export default function UsersPage() {
  const { showToast } = useToast();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);

  const { data: users, isLoading, execute: fetchUsers, error } = useRequest(userService.getUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const { run: deleteUser, isLoading: isDeleting } = useAsyncAction(
    async (id: string) => {
      await userService.delete(id);
    },
    {
      onSuccess: () => {
        showToast({ type: 'success', title: "User Deleted", description: `${deletingUser?.name} has been removed.` });
        fetchUsers();
        setIsDeleteDialogOpen(false);
        setDeletingUser(null);
      }
    }
  );

  const handleCreate = () => {
    setEditingUser(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsDrawerOpen(false);
    fetchUsers();
    showToast({ type: 'success', title: "Success", description: `User has been successfully ${editingUser ? 'updated' : 'created'}.` });
  };
  
  const openDeleteDialog = (user: SystemUser) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirm = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
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
          <p>Failed to load users: {error.message}</p>
        </div>
      )
    }
    if (users) {
      return (
          <>
            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {users.map(user => (
                    <MobileUserCard key={user.id} user={user} onEdit={handleEdit} onDelete={openDeleteDialog} />
                ))}
            </div>
            
            {/* Desktop View */}
            <div className="hidden md:block">
                <UsersTable users={users} onEdit={handleEdit} onDelete={openDeleteDialog} />
            </div>
        </>
      );
    }
    return null;
  }

  return (
    <RouteGuard permission='users.manage'>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <Button onClick={handleCreate}>
                <PlusCircle />
                Create User
            </Button>
        </div>

        {renderContent()}

        {isDrawerOpen && (
           <UserFormDrawer
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              user={editingUser}
              onSaveSuccess={handleSaveSuccess}
          />
        )}
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the user <span className="font-bold">{deletingUser?.name}</span>. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      </div>
    </RouteGuard>
  );
}
