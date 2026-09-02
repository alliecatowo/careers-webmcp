
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Application } from "@/types";
import { JobStatusBadge } from "@/modules/jobs/components/JobStatusBadge";
import Link from 'next/link';

interface ApplicationsTabProps {
    applications: (Application & { jobTitle: string })[];
}

export function ApplicationsTab({ applications }: ApplicationsTabProps) {
    if (applications.length === 0) {
        return <p className="text-muted-foreground">This candidate has not applied for any jobs.</p>;
    }

    return (
        <Card>
            <CardHeader><CardTitle>Application History</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <caption className="sr-only">A table of the candidate's application history.</caption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied On</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.map(app => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/jobs/${app.jobId}/pipeline`} className="hover:underline text-primary">
                                        {app.jobTitle}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <JobStatusBadge status={app.status as any} />
                                </TableCell>
                                <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
