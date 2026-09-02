
'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SystemUser } from '../domain/user.entity';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AccessGuard } from "@/components/system/AccessGuard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";


interface UsersTableProps {
  users: SystemUser[];
  onEdit: (user: SystemUser) => void;
  onDelete: (user: SystemUser) => void;
}


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

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
    <>
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {users.map(user => (
                <MobileUserCard key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>

        {/* Desktop View */}
        <div className="rounded-lg border hidden md:block">
            <Table>
                <caption className="sr-only">A table of system users and their roles.</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
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
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </>
  );
}
