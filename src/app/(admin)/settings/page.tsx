
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/context/TenantContext";
import { KeyRound, Shield, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const { user } = useAuth();
    const { currentOrganization } = useTenant();

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Settings</CardTitle>
                            <CardDescription>Manage settings for {currentOrganization?.name || 'your organization'}.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="org-name">Organization Name</Label>
                                <Input id="org-name" value={currentOrganization?.name} disabled />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <Label htmlFor="sso-enabled">Enable Single Sign-On (SSO)</Label>
                                <Switch id="sso-enabled" disabled />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled>Save Organization Settings</Button>
                        </CardFooter>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Manage how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifs">New Candidate Email Alerts</Label>
                                <Switch id="email-notifs" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="push-notifs">Weekly Summary Emails</Label>
                                <Switch id="push-notifs" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Shield /> Security</CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/roles"><KeyRound className="mr-2"/> View Roles & Permissions</Link>
                            </Button>
                             <Button variant="outline" className="w-full" asChild>
                                <Link href="/audit-logs"><LinkIcon className="mr-2"/> View Audit Logs</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
