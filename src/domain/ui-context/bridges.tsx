'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUiContextStore } from './ui-context.store';

/** Mounted once in AppProvider. Publishes router state into the ui-context store. */
export function PageContextBridge() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setRoute = useUiContextStore((s) => s.setRoute);
  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams?.forEach((v, k) => {
      params[k] = v;
    });
    setRoute(pathname ?? '/', params);
  }, [pathname, searchParams, setRoute]);
  return null;
}

/** Rendered by the job detail page so context knows the current job without scraping. */
export function CurrentJobBridge({ jobId }: { jobId: string }) {
  const setCurrentJob = useUiContextStore((s) => s.setCurrentJob);
  useEffect(() => {
    setCurrentJob(jobId);
    return () => setCurrentJob(null);
  }, [jobId, setCurrentJob]);
  return null;
}

/** Rendered by the application page so context knows the current draft. */
export function CurrentApplicationBridge({ applicationId }: { applicationId: string | null }) {
  const setCurrentApplication = useUiContextStore((s) => s.setCurrentApplication);
  useEffect(() => {
    setCurrentApplication(applicationId);
    return () => setCurrentApplication(null);
  }, [applicationId, setCurrentApplication]);
  return null;
}
