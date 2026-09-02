
'use client';
import { DataColumn } from "@/components/system/DataTable";
import { ApplicationStatus, ApplicationWithCandidate, applicationStatuses } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface WorkflowActions {
    onStatusChange: (applicationId: string, status: ApplicationStatus) => void;
    onNotify: (applicationId: string) => void;
    onEmail: (applicationId: string) => void;
}

const statusStyles: Record<string, string> = {
  APPLIED: "border-transparent bg-blue-100 text-blue-900",
  SCREENED: "border-transparent bg-purple-100 text-purple-900",
  INTERVIEW: "border-transparent bg-yellow-100 text-yellow-900",
  PLACED: "border-transparent bg-green-100 text-green-900",
  REJECTED: "border-transparent bg-red-100 text-red-900",
  OFFER: "border-transparent bg-pink-100 text-pink-900",
};

export const StudentApplicationColumns = (actions: WorkflowActions): DataColumn<ApplicationWithCandidate>[] => [
    { key: 'candidateName', header: 'Student' },
    { key: 'jobTitle', header: 'Job Applied For' },
    { 
        key: 'status', 
        header: 'Status',
        render: (row) => (
            <Badge className={statusStyles[row.status] || ""}>
                {row.status.replace(/_/g, ' ')}
            </Badge>
        )
    },
    { key: 'score', header: 'AI Score', render: (row) => row.score ?? '-' },
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
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => actions.onNotify(row.id)}>Send In-App Notification</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => actions.onEmail(row.id)}>Send Email (Mock)</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {applicationStatuses.map(status => (
                                <DropdownMenuItem key={status} onSelect={() => actions.onStatusChange(row.id, status)}>
                                    Set as {status.replace(/_/g, ' ')}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
      )
    }
];
