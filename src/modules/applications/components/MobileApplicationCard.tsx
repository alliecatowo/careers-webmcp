
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationWithCandidate } from "@/types";
import { applicationColumns } from './ApplicationColumns';
import { MoreHorizontal, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

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

export function MobileApplicationCard({ application, onViewDetails }: { application: ApplicationWithCandidate, onViewDetails: (id: string) => void }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{application.candidateName}</CardTitle>
                    <Badge className={stageColors[application.status] || ""}>
                        {application.status.replace(/_/g, ' ')}
                    </Badge>
                </div>
                <CardDescription>{application.jobTitle}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
                Applied on: {new Date(application.createdAt).toLocaleDateString()}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 <Button variant="outline" size="sm" className="w-full" onClick={() => onViewDetails(application.id)}>
                    <Eye className="mr-2 h-4 w-4" /> View Details
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full">
                            <MoreHorizontal className="mr-2 h-4 w-4" /> More Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/candidates/${application.candidateId}`}>View Profile</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                           <Link href={`/jobs/${application.jobId}/pipeline`}>View in Pipeline</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}
