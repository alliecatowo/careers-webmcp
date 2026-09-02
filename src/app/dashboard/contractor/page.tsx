'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle, Clock, FolderKanban } from 'lucide-react';
import Link from 'next/link';
import { useRequest } from '@/lib/request/useRequest';
import { invitationService } from '@/services/service';
import { InvitationList } from '@/components/organisms/InvitationList';
import { useAuthStore } from '@/store/auth.store';
import { Skeleton } from "@/components/ui/skeleton";

export default function ContractorDashboardPage() {
  const { user } = useAuthStore();
  const { data: invitationsResponse, isLoading, execute: refreshInvitations } = useRequest(() => {
    if (user?.id) {
      return invitationService.getForUser(user.id);
    }
    return Promise.resolve({ success: true, data: [] });
  }, [user?.id]);
  
  const invitations = invitationsResponse?.data || [];

  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contractor Dashboard</h1>
        <p className="text-muted-foreground">Manage your applications and ongoing projects.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Currently assigned to you</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
             <p className="text-xs text-muted-foreground">Milestones awaiting your work</p>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <InvitationList invitations={invitations} onUpdate={refreshInvitations} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Welcome, Contractor!</CardTitle>
          <CardDescription>This is your dashboard to manage applications and active projects.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button asChild>
                <Link href="/projects">
                    <FolderKanban className="mr-2 h-4 w-4" />
                    Browse Projects
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
