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
import { JobStatusBadge } from "./JobStatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Department, Job } from "@/lib/talent-acquisition/types";

interface JobsTableProps {
  jobs: Job[];
  departments: Department[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

function MobileJobCard({ job, departmentName, onEdit, onDelete }: { job: Job; departmentName: string; onEdit: (job: Job) => void; onDelete: (id: string) => void; }) {
    return (
        <Card>
            <AlertDialog>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{job.title}</CardTitle>
                        <JobStatusBadge status={job.status} />
                    </div>
                    <CardDescription>{departmentName} - {job.city}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    <p>Applicants: {job.applicants || 0}</p>
                    <p>Created: {new Date(job.createdAt).toLocaleDateString()}</p>
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
                            <DropdownMenuItem onSelect={() => onEdit(job)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/jobs/${job.id}/pipeline`}>View Pipeline</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the job and all associated applications.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(job.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

export function JobsTable({ jobs, departments, onEdit, onDelete }: JobsTableProps) {
  const departmentMap = new Map(departments.map(d => [d.id, d.name]));

  return (
    <>
        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
            {jobs.map(job => (
                <MobileJobCard key={job.id} job={job} departmentName={departmentMap.get(job.departmentId) || 'N/A'} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>

        {/* Desktop View */}
        <div className="rounded-lg border hidden md:block">
            <Table>
                <caption className="sr-only">A table of job postings.</caption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Applicants</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.map((job) => (
                    <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{departmentMap.get(job.departmentId) || 'N/A'}</TableCell>
                        <TableCell>{job.city}</TableCell>
                        <TableCell>
                            <JobStatusBadge status={job.status} />
                        </TableCell>
                        <TableCell className="text-center">{job.applicants || 0}</TableCell>
                        <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <AlertDialog>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onSelect={() => onEdit(job)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem asChild><Link href={`/jobs/${job.id}/pipeline`}>View Pipeline</Link></DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the job and all associated applications.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDelete(job.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </>
  );
}
