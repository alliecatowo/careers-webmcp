
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";

interface CandidateHeaderProps {
    candidate: Candidate;
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                    {candidate.avatarUrl && <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />}
                    <AvatarFallback className="text-4xl">{candidate.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{candidate.name}</h1>
                    <p className="text-muted-foreground text-lg">{candidate.jobTitle}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4"/>{candidate.email}</span>
                        {candidate.parsedData?.phone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4"/>{candidate.parsedData.phone}</span>}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <MessageSquare className="mr-2"/>
                    Send Message
                </Button>
                 <Button asChild>
                    <Link href={`/jobs/${candidate.jobId}/pipeline`}>
                        <Eye className="mr-2" />
                        View in Pipeline
                    </Link>
                </Button>
            </div>
        </div>
    );
}
