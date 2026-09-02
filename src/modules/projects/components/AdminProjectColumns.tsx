
'use client';

import { DataColumn } from "@/components/system/DataTable";
import { Project, ProjectStatus } from "../domain/project.entity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";

const statusStyles: Record<ProjectStatus, string> = {
    OPEN: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
    ACTIVE: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
    COMPLETED: "border-transparent bg-gray-100 text-gray-900 dark:bg-gray-900/50 dark:text-gray-300",
    DRAFT: "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300",
    GOVERNANCE_REVIEW: "border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300",
};

const allStatuses: ProjectStatus[] = ['DRAFT', 'GOVERNANCE_REVIEW', 'OPEN', 'ACTIVE', 'COMPLETED'];


export const adminProjectColumns = (onStatusChange: (id: string, status: ProjectStatus) => void): DataColumn<Project>[] => [
  {
    key: "title",
    header: "Project Title",
    render: (row) => (
      <div>
        <p className="font-semibold">{row.title}</p>
        <p className="text-xs text-muted-foreground">{row.category}</p>
      </div>
    ),
  },
  {
    key: "budget",
    header: "Budget",
    render: (row) => formatCurrency(row.budget, row.currency),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge className={statusStyles[row.status]}>{row.status.replace('_', ' ')}</Badge>,
  },
  {
    key: 'owner',
    header: 'Owner',
  },
  {
    key: 'createdAt',
    header: 'Created On',
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    render: (row) => (
       <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {allStatuses.map(status => (
                        <DropdownMenuItem key={status} onSelect={() => onStatusChange(row.id, status)}>
                          Set as {status.replace('_', ' ')}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete Project</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
  }
];
