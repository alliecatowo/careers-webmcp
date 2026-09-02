'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types";
import { useSearchParams } from 'next/navigation';

// Tab Components
import { OverviewTab } from "./tabs/OverviewTab";
import { ApplicationsTab } from "./tabs/ApplicationsTab";
import { InterviewsTab } from "./tabs/InterviewsTab";
import { OffersTab } from "./tabs/OffersTab";
import { DocumentsTab } from "./tabs/DocumentsTab";
import { ProfileSettingsTab } from "./tabs/SettingsTab";
import { BankingTab } from "./tabs/BankingTab";

interface DashboardTabsProps {
    user: User;
}

export function DashboardTabs({ user }: DashboardTabsProps) {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'overview';

    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
                <TabsTrigger value="offers">Offers</TabsTrigger>
                <TabsTrigger value="documents">Documents & Certificates</TabsTrigger>
                <TabsTrigger value="settings">Profile & Settings</TabsTrigger>
                <TabsTrigger value="banking">Banking & Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
                <OverviewTab user={user} />
            </TabsContent>
            <TabsContent value="applications" className="mt-6">
                <ApplicationsTab user={user} />
            </TabsContent>
            <TabsContent value="interviews" className="mt-6">
                <InterviewsTab user={user} />
            </TabsContent>
             <TabsContent value="offers" className="mt-6">
                <OffersTab user={user} />
            </TabsContent>
            <TabsContent value="documents" className="mt-6">
                <DocumentsTab user={user} />
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
                <ProfileSettingsTab user={user} />
            </TabsContent>
            <TabsContent value="banking" className="mt-6">
                <BankingTab />
            </TabsContent>
        </Tabs>
    );
}
