
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
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Interview, InterviewStatus } from "../domain/interview.entity";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface InterviewsTableProps {
  interviews: Interview[];
  onStatusChange: (id: string, status: InterviewStatus) => void;
}

const statusColors: Record<InterviewStatus, string> = {
    SCHEDULED: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
    COMPLETED: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
    CANCELLED: "border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

function MobileInterviewCard({ interview, onStatusChange }: { interview: Interview; onStatusChange: (id: string, status: InterviewStatus) => void; }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{interview.candidateName}</CardTitle>
                    <Badge className={statusColors[interview.status]}>{interview.status}</Badge>
                </div>
                <CardDescription>{interview.jobTitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div><span className="font-semibold">Scheduled:</span> {new Date(interview.scheduledAt).toLocaleString()}</div>
                <div><span className="font-semibold">Interviewer(s):</span> {interview.interviewerNames.join(", ")}</div>
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
                        <DropdownMenuItem disabled={interview.status !== 'SCHEDULED'} onSelect={() => onStatusChange(interview.id, 'COMPLETED')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled={interview.status !== 'SCHEDULED'} onSelect={() => onStatusChange(interview.id, 'CANCELLED')}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Interview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled>
                            Submit Feedback
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}

export function InterviewsTable({ interviews, onStatusChange }: InterviewsTableProps) {
  return (
    <>
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {interviews.map(interview => (
                <MobileInterviewCard key={interview.id} interview={interview} onStatusChange={onStatusChange} />
            ))}
        </div>

        {/* Desktop View */}
        <div className="rounded-lg border hidden md:block">
            <Table>
                <caption className="sr-only">A table of scheduled interviews.</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Job</TableHead>
                        <TableHead>Interviewer(s)</TableHead>
                        <TableHead>Scheduled For</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {interviews.map((interview) => (
                    <TableRow key={interview.id}>
                        <TableCell className="font-medium">{interview.candidateName}</TableCell>
                        <TableCell>{interview.jobTitle}</TableCell>
                        <TableCell>{interview.interviewerNames.join(", ")}</TableCell>
                        <TableCell>{new Date(interview.scheduledAt).toLocaleString()}</TableCell>
                        <TableCell>
                            <Badge className={statusColors[interview.status]}>{interview.status}</Badge>
                        </TableCell>
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
                                    <DropdownMenuItem disabled={interview.status !== 'SCHEDULED'} onSelect={() => onStatusChange(interview.id, 'COMPLETED')}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Completed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={interview.status !== 'SCHEDULED'} onSelect={() => onStatusChange(interview.id, 'CANCELLED')}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Interview
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem disabled>
                                        Submit Feedback
                                    </DropdownMenuItem>
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
