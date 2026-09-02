
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Candidate } from "@/modules/candidates/candidates.types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentCandidatesProps {
    candidates: Candidate[];
}

export function RecentCandidates({ candidates }: RecentCandidatesProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Candidates</CardTitle>
                <CardDescription>The latest candidates to enter the pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
                {candidates.length > 0 ? (
                    <div className="space-y-4">
                        {candidates.map(candidate => (
                            <div key={candidate.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{candidate.name}</p>
                                        <p className="text-sm text-muted-foreground">{candidate.jobTitle}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href={`/candidates/${candidate.id}`}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent candidates.</p>
                )}
            </CardContent>
        </Card>
    );
}
