
'use client';

import { DataColumn } from "@/components/system/DataTable";
import { Candidate, CandidateStage } from "../candidates.types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stageColors: { [key: string]: string } = {
  APPLIED: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
  SCREENED: "border-transparent bg-purple-100 text-purple-900 dark:bg-purple-900/50 dark:text-purple-300",
  TECHNICAL_ROUND: "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300",
  HR_ROUND: "border-transparent bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-300",
  FINAL_ROUND: "border-transparent bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-300",
  OFFER: "border-transparent bg-pink-100 text-pink-900 dark:bg-pink-900/50 dark:text-pink-300",
  HIRED: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
  REJECTED: "border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

export const candidateColumns: DataColumn<Candidate>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <span className="font-medium">{row.name}</span>
          <p className="text-xs text-muted-foreground">{row.email}</p>
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
    key: "stage",
    header: "Stage",
    sortable: true,
    render: (row) => (
      <Badge className={stageColors[row.stage] || ""}>
        {row.stage.replace(/_/g, ' ')}
      </Badge>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    sortable: true,
    align: "center",
    render: (row) => (
      <div className="flex items-center justify-center gap-1">
        {row.rating} <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
      </div>
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
                   <Link href={`/candidates/${row.id}`}>View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete Candidate</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ),
  }
];
