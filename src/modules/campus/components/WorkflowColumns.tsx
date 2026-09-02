'use client';

import { DataColumn } from "@/components/system/DataTable";
import { ApplicationWithCandidate } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface WorkflowActions {
    onSchedule: (applicationId: string) => void;
    onOffer: (applicationId: string) => void;
    onReject: (applicationId: string) => void;
}

const statusStyles: Record<string, string> = {
  APPLIED: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
  SCREENED: "border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300",
  INTERVIEW: "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300",
  PLACED: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
  REJECTED: "border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300",
  OFFER: "border-transparent bg-pink-100 text-pink-900 dark:bg-pink-900/50 dark:text-pink-300",
};

export const WorkflowColumns = (actions: WorkflowActions): DataColumn<ApplicationWithCandidate & { score?: number | null, interviewDateTime?: string, offerDate?: string }>[] => [
    { key: 'candidateName', header: 'Student' },
    { key: 'jobTitle', header: 'Job' },
    { 
        key: 'status', 
        header: 'Status',
        render: (row) => (
            <Badge className={statusStyles[row.status] || ""}>
                {row.status.replace(/_/g, ' ')}
            </Badge>
        )
    },
    { key: 'interviewDateTime', header: 'Interview Date', render: (row) => row.interviewDateTime ? new Date(row.interviewDateTime).toLocaleString() : '-' },
    { key: 'offerDate', header: 'Offer Date', render: (row) => row.offerDate ? new Date(row.offerDate).toLocaleDateString() : '-' },
    { 
      key: 'score', 
      header: 'AI Score',
      align: 'center',
      render: (row) => row.score ?? '-'
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Workflow Actions</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => actions.onSchedule(row.id)}>Schedule Interview</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => actions.onOffer(row.id)}>Send Offer</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => actions.onReject(row.id)} className="text-destructive">Reject</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    }
];
