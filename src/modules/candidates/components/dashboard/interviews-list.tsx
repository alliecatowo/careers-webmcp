
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { interviewService } from '@/services/interview.service';
import { Interview } from '@/modules/interviews/domain/interview.entity';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Check, Video } from 'lucide-react';
import Link from 'next/link';
import { useTimezone } from '@/hooks/use-timezone';

function InterviewCard({ interview }: { interview: Interview }) {
    const { toLocalTime } = useTimezone();
    const isUpcoming = new Date(interview.scheduledAt) > new Date();

    return (
        <Card>
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isUpcoming ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="font-semibold">{interview.jobTitle} - {interview.stage.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                            {toLocalTime(new Date(interview.scheduledAt), { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                         <p className="text-xs text-muted-foreground">
                            with {interview.interviewerNames.join(', ')}
                        </p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                     {isUpcoming ? (
                         <Button asChild>
                            <Link href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                <Video className="mr-2 h-4 w-4" /> Join Meeting
                            </Link>
                        </Button>
                     ) : (
                         <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                            <Check className="h-4 w-4" /> Completed
                         </div>
                     )}
                </div>
            </CardContent>
        </Card>
    )
}

export function InterviewsList() {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!user) return;
            setIsLoading(true);
            const data = await interviewService.getInterviewsForCandidate(user.id);
            setInterviews(data.sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
            setIsLoading(false);
        };
        fetchInterviews();
    }, [user]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        )
    }

    if (interviews.length === 0) {
        return (
            <div className="text-center py-16 border border-dashed rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Interviews Scheduled</h3>
                <p className="mt-1 text-sm text-muted-foreground">You do not have any interviews scheduled at this time.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {interviews.map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
            ))}
        </div>
    )
}
