'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { candidateService } from '@/services/candidate.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandidateHeader } from '@/modules/candidates/components/profile/CandidateHeader';
import { OverviewTab } from '@/modules/candidates/components/profile/OverviewTab';
import { ApplicationsTab } from '@/modules/candidates/components/profile/ApplicationsTab';
import { NotesTab } from '@/modules/candidates/components/profile/NotesTab';
import { TimelineTab } from '@/modules/candidates/components/profile/TimelineTab';
import { CandidateProfileData } from '@/types';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid grid-cols-3 gap-8 pt-6">
        <div className="col-span-2 space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="col-span-1 space-y-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function CandidateProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [profileData, setProfileData] = useState<CandidateProfileData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      candidateService
        .getCandidateProfile(id)
        .then((data) => {
          setProfileData(data);
          setIsLoading(false);
        })
        .catch(() => {
          setProfileData(null);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profileData) {
    return notFound();
  }

  const { candidate, applications, notes, stageHistories } = profileData;

  return (
    <div className="space-y-6">
      <CandidateHeader candidate={candidate} />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:max-w-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <OverviewTab candidate={candidate} />
        </TabsContent>
        <TabsContent value="applications" className="mt-6">
          <ApplicationsTab
            applications={applications.map((app) => ({
              ...app,
              jobTitle: app.jobTitle || 'Unknown Job',
            }))}
          />
        </TabsContent>
        <TabsContent value="notes" className="mt-6">
          <NotesTab candidateId={candidate.id} initialNotes={notes} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <TimelineTab history={stageHistories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
