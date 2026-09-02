'use client';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export function WelcomeBanner() {
    const { user } = useAuth();
    return (
        <Card className="p-6 border-none bg-gradient-to-r from-primary/10 to-transparent">
            <CardTitle className="text-2xl font-bold">Welcome back, {user?.name}!</CardTitle>
            <CardDescription className="mt-1">Here's a snapshot of your recruiting activity today.</CardDescription>
        </Card>
    )
}
