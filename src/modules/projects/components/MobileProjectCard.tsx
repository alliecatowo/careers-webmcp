
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Project, ProjectStatus } from "../domain/project.entity";
import { formatCurrency } from "@/lib/utils/currency";

const statusStyles: Record<ProjectStatus, string> = {
    OPEN: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
    ACTIVE: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
    COMPLETED: "border-transparent bg-gray-100 text-gray-900 dark:bg-gray-900/50 dark:text-gray-300",
    DRAFT: "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300",
    GOVERNANCE_REVIEW: "border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300",
};

const allStatuses: ProjectStatus[] = ['DRAFT', 'GOVERNANCE_REVIEW', 'OPEN', 'ACTIVE', 'COMPLETED'];

export function MobileProjectCard({ project, onStatusChange }: { project: Project, onStatusChange: (id: string, status: ProjectStatus) => void }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{project.title}</CardTitle>
                    <Badge className={statusStyles[project.status]}>{project.status.replace('_', ' ')}</Badge>
                </div>
                <CardDescription>{project.category}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
                <div><span className="font-semibold">Budget:</span> {formatCurrency(project.budget, project.currency)}</div>
                <div><span className="font-semibold">Owner:</span> {project.owner}</div>
                <div><span className="font-semibold">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</div>
            </CardContent>
            <CardFooter>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                            <MoreHorizontal className="mr-2 h-4 w-4" /> Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {allStatuses.map(status => (
                                        <DropdownMenuItem key={status} onSelect={() => onStatusChange(project.id, status)}>
                                        Set as {status.replace('_', ' ')}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
