'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getStageLabel } from '@/lib/candidate/statusEngine';
import { Application } from '@/types';

// This component expects the application objects to have jobTitle pre-filled.
interface ApplicationWithJobTitle extends Application {
    jobTitle: string;
}

interface ApplicationListProps {
    applications: ApplicationWithJobTitle[];
}

export function ApplicationList({ applications }: ApplicationListProps) {
    if (applications.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>My Applications</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">You have not submitted any applications yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {applications.map((app) => (
                    <div key={app.id} className="p-4 border rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{app.jobTitle}</p>
                            <p className="text-sm text-muted-foreground">
                                Applied on: {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                             <Badge variant="outline">{getStageLabel(app.status)}</Badge>
                             <Button asChild variant="ghost" size="icon">
                                <Link href={`/my-account/applications/${app.id}`}>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
