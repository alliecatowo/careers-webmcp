
'use client';

import { DataColumn } from "@/components/system/DataTable";
import { ApplicationWithCandidate } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stageColors: Record<string, string> = {
  APPLIED: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
  SCREENED: "border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300",
  TECHNICAL_ROUND: "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300",
  HR_ROUND: "border-transparent bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300",
  FINAL_ROUND: "border-transparent bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300",
  OFFER: "border-transparent bg-pink-100 text-pink-900 dark:bg-pink-900/50 dark:text-pink-300",
  HIRED: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
  REJECTED: "border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

export const applicationColumns = (onViewDetails: (applicationId: string) => void): DataColumn<ApplicationWithCandidate>[] => [
  {
    key: "candidateName",
    header: "Candidate",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{row.candidateName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <span className="font-medium">{row.candidateName}</span>
          <p className="text-xs text-muted-foreground">{row.candidateEmail}</p>
        </div>
      </div>
    ),
  },
  {
    key: "jobTitle",
    header: "Applied For",
    sortable: true,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (row) => (
      <Badge className={stageColors[row.status] || ""}>
        {row.status.replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Applied On",
    sortable: true,
    render: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    key: 'actions',
    header: 'Actions',
    align: 'right',
    render: (row) => (
       <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(row.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                       <Link href={`/candidates/${row.candidateId}`}>View Profile</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link href={`/jobs/${row.jobId}/pipeline`}>View in Pipeline</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
       </div>
    ),
  }
];
