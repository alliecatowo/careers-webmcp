'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useSessionStore } from '@/domain/session/session.store';
import { getApplication } from '@/domain/applications';

function SuccessContent() {
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId');
  const candidate = useSessionStore((s) => s.candidate);

  const application = candidate && appId ? getApplication(candidate.id, appId) : null;

  return (
    <div className="flex items-center justify-center py-24">
      <Card className="max-w-2xl text-center" data-testid="application-submitted">
        <CardHeader className="items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          {application && (
            <Badge variant="secondary" className="mb-2">
              {application.status === 'submitted' ? 'Submitted' : application.status}
            </Badge>
          )}
          <CardTitle className="text-3xl">Application Submitted!</CardTitle>
          <CardDescription>
            {application
              ? (
                <>
                  Thank you for applying to <span className="font-semibold">{application.jobTitle}</span>.
                </>
              )
              : 'Thank you for your interest in Northwind.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            We have received your application and our talent team will review it shortly. You can track the status
            of your application in your candidate dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild>
              <Link href="/careers/open-positions">Return to Open Positions</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/my-account">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Loader2 className="h-12 w-12 animate-spin text-primary" />}>
      <SuccessContent />
    </Suspense>
  );
}
