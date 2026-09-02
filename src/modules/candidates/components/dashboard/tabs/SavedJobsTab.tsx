'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionStore } from '@/domain/session/session.store';
import { listSavedJobIds, setJobSaved, useSavedJobsStore } from '@/domain/saved-jobs';
import { talentService } from '@/services/talent.service';
import type { Job, Country } from '@/lib/talent-acquisition';

interface SavedJobRow {
  jobId: string;
  job: Job | null;
  countrySlug: string | null;
}

export function SavedJobsTab() {
  const candidate = useSessionStore((s) => s.candidate);
  const signInAsDemoCandidate = useSessionStore((s) => s.signInAsDemoCandidate);
  // Subscribe so saves/unsaves from elsewhere (including via WebMCP) show up live.
  useSavedJobsStore((s) => (candidate ? s.savedByCandidate[candidate.id] : s.savedByCandidate));

  const savedJobIds = candidate ? listSavedJobIds(candidate.id) : [];
  const [rows, setRows] = useState<SavedJobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const savedJobIdsKey = savedJobIds.join(',');

  useEffect(() => {
    let cancelled = false;
    if (savedJobIds.length === 0) {
      setRows([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    Promise.all(
      savedJobIds.map(async (jobId) => {
        const job = await talentService.getJobById(jobId);
        let countrySlug: string | null = null;
        if (job) {
          const country: Country | undefined = await talentService.getCountryById(job.countryId);
          countrySlug = country?.slug ?? null;
        }
        return { jobId, job: job ?? null, countrySlug };
      }),
    ).then((results) => {
      if (!cancelled) {
        setRows(results);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedJobIdsKey]);

  if (!candidate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Sign in as the demo candidate to see your saved jobs.</p>
          <Button onClick={() => signInAsDemoCandidate()}>Continue as demo candidate</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You haven't saved any jobs yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Jobs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map(({ jobId, job, countrySlug }) => (
          <div key={jobId} className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold">{job?.title ?? 'Job no longer available'}</p>
              {job && countrySlug && (
                <Link
                  href={`/careers/countries/${countrySlug}/jobs/${job.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View job
                </Link>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              title="Remove from saved jobs"
              onClick={() => setJobSaved(candidate.id, jobId, false)}
            >
              <Bookmark className="h-4 w-4 fill-current" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
