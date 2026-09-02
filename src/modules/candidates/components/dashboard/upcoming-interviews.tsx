
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Interview } from '@/modules/interviews/domain/interview.entity';
import { Calendar } from 'lucide-react';
import { useTimezone } from '@/hooks/use-timezone';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UpcomingInterviewsProps {
    interviews: Interview[];
    isLoading: boolean;
}

export function UpcomingInterviews({ interviews, isLoading }: UpcomingInterviewsProps) {
    const { toLocalTime } = useTimezone();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                ) : interviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">You have no upcoming interviews scheduled.</p>
                ) : (
                    <ul className="space-y-4">
                        {interviews.map((interview) => (
                            <li key={interview.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{interview.jobTitle} - {interview.stage.replace('_', ' ')}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {toLocalTime(interview.scheduledAt, { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <Button asChild variant="secondary">
                                    <Link href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                        Join Meeting
                                    </Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
