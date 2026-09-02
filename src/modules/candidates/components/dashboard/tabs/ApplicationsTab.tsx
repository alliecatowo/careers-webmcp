'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/domain/session/session.store';
import { applicationUrl, listApplications, useApplicationsStore, type ApplicationDraft } from '@/domain/applications';

function statusBadgeVariant(status: ApplicationDraft['status']): 'default' | 'secondary' | 'outline' {
  if (status === 'submitted') return 'secondary';
  return 'outline';
}

function applicationLink(app: ApplicationDraft): string {
  if (app.status === 'submitted') {
    return `/careers/application/${app.countrySlug}/success?appId=${app.id}`;
  }
  return applicationUrl(app);
}

export function ApplicationsTab() {
  const candidate = useSessionStore((s) => s.candidate);
  const signInAsDemoCandidate = useSessionStore((s) => s.signInAsDemoCandidate);
  // Subscribe so applications started/updated elsewhere (including via WebMCP) show up live.
  useApplicationsStore((s) => s.applications);

  if (!candidate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Sign in as the demo candidate to see your applications.</p>
          <Button onClick={() => signInAsDemoCandidate()}>Continue as demo candidate</Button>
        </CardContent>
      </Card>
    );
  }

  const applications = listApplications(candidate.id);

  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have not started any applications yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <p className="font-semibold">{app.jobTitle}</p>
              <p className="text-sm text-muted-foreground">
                Updated {new Date(app.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={statusBadgeVariant(app.status)}>{app.status}</Badge>
              <Button asChild variant="ghost" size="icon">
                <Link href={applicationLink(app)}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
