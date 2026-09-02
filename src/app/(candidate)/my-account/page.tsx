'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DashboardTabs } from '@/modules/candidates/components/dashboard/DashboardTabs';

function CandidateProfileHeader({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-16 w-16 border-2 border-primary">
                {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : (
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                )}
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Track your application status and manage your profile.</p>
            </div>
        </div>
    );
}

export default function CandidateDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // This is where you would fetch initial dashboard-wide data if needed.
        // For this implementation, data fetching is handled within each tab.
        if (!isAuthLoading) {
            setIsLoadingData(false);
        }
    }, [isAuthLoading]);
    
    const isLoading = isAuthLoading || isLoadingData;

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 space-y-8">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    if (error) {
         return (
            <div className="container mx-auto py-16 text-center">
                <Card className="max-w-lg mx-auto border-destructive bg-destructive/5">
                    <CardContent className="p-8">
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                        <h2 className="mt-4 text-2xl font-semibold text-destructive">Could not load dashboard</h2>
                        <p className="mt-2 text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
         return (
             <div className="container mx-auto py-16 text-center">
                 <Card className="max-w-lg mx-auto">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-semibold">Please Log In</h2>
                        <p className="mt-2 text-muted-foreground">
                           You need to be logged in to view your dashboard.
                        </p>
                    </CardContent>
                </Card>
             </div>
         )
    }

    return (
        <div className="container mx-auto py-8">
            <CandidateProfileHeader user={user} />
            <DashboardTabs user={user} />
        </div>
    );
}
