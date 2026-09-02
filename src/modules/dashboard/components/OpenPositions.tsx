
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { JobSummary } from "@/modules/jobs/jobs.types";
import Link from "next/link";
import { Users } from "lucide-react";

interface OpenPositionsProps {
    jobs: JobSummary[];
}

export function OpenPositions({ jobs }: OpenPositionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardDescription>A summary of your active job postings.</CardDescription>
            </CardHeader>
            <CardContent>
                 {jobs.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <Link key={job.id} href={`/jobs/${job.id}/pipeline`} className="block p-3 rounded-lg hover:bg-muted">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{job.title}</p>
                                        <p className="text-sm text-muted-foreground">{job.department}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span className="font-semibold">{job.applicants}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No open positions.</p>
                )}
            </CardContent>
        </Card>
    );
}
