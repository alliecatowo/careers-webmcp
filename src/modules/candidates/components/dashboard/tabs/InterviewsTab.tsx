
'use client';

import { User } from "@/types";
import { InterviewsList } from "../interviews-list";

interface InterviewsTabProps {
    user: User;
}

export function InterviewsTab({ user }: InterviewsTabProps) {
    return (
         <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">My Interviews</h1>
                <p className="text-muted-foreground">Review your past and upcoming interviews.</p>
            </div>
            <InterviewsList />
        </div>
    );
}
