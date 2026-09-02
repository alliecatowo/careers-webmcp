'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock function to calculate completeness
const calculateProfileCompleteness = (user: any): number => {
    let score = 0;
    if (user?.name) score += 25;
    if (user?.email) score += 25;
    // In a real app, you'd check for resume, phone number, work experience, etc.
    // Let's assume a static 75% for demonstration.
    return 75;
}

export function ProfileCompletenessIndicator() {
    const completeness = calculateProfileCompleteness({}); // Pass user object here in real app

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Completeness</CardTitle>
                <CardDescription>A complete profile helps recruiters learn more about you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Progress value={completeness} className="flex-1" />
                    <span className="font-bold text-lg text-primary">{completeness}%</span>
                </div>
                {completeness < 100 && (
                    <div className="text-center">
                        <Button variant="secondary" asChild>
                            <Link href="/my-account/profile">Complete Your Profile</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
