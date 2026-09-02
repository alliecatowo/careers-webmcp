
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileCompletenessIndicator } from '../profile-completeness';
import { ProfileForm } from "../profile-form";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface ProfileSettingsTabProps {
    user: User;
}

export function ProfileSettingsTab({ user }: ProfileSettingsTabProps) {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
                <p className="text-muted-foreground">Manage your personal information and application materials.</p>
             </div>
             
             <ProfileCompletenessIndicator />
             
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Keep your contact details up to date.</CardDescription>
                </CardHeader>
                <CardContent>
                   <ProfileForm user={user} />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>This is how your profile appears to others. You can share this link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href={`/profiles/${user.id}`} target="_blank" rel="noopener noreferrer">View Public Profile</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
