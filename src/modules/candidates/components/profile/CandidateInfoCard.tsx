
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "@/types";
import { Globe, Linkedin } from "lucide-react";
import Link from "next/link";

interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
    if (!value) return null;
    return (
        <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-right">{value}</p>
        </div>
    );
}

export function CandidateInfoCard({ candidate }: { candidate: Candidate }) {
    const { parsedData } = candidate;

    return (
        <Card>
            <CardHeader><CardTitle>Candidate Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <InfoRow label="Email" value={<a href={`mailto:${candidate.email}`} className="text-primary hover:underline">{candidate.email}</a>} />
                <InfoRow label="Phone" value={parsedData?.phone} />
                <InfoRow label="Location" value={candidate.country} />
                <InfoRow label="Total Experience" value={parsedData ? `${Math.floor(parsedData.totalExperienceMonths / 12)} years` : 'N/A'} />
                <InfoRow label="LinkedIn" value={parsedData?.linkedin ? (
                    <Link href={parsedData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Linkedin className="h-3 w-3"/> Profile
                    </Link>
                ) : 'N/A'} />
                 <InfoRow label="Portfolio/GitHub" value={parsedData?.github ? (
                    <Link href={parsedData.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Globe className="h-3 w-3"/> Link
                    </Link>
                ) : 'N/A'} />
            </CardContent>
        </Card>
    );
}
