'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStageLabel } from '@/lib/candidate/statusEngine';
import { Application, Candidate } from '@/types';

interface ApplicationHeaderProps {
    application: Application;
    candidate: Candidate;
}

export function ApplicationHeader({ application, candidate }: ApplicationHeaderProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl">{candidate.jobTitle}</CardTitle>
                        <CardDescription>Application for {candidate.name}</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg">{getStageLabel(application.status)}</Badge>
                </div>
            </CardHeader>
        </Card>
    );
}
