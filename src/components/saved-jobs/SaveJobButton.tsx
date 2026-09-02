'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/domain/session/session.store';
import { isJobSaved, setJobSaved, useSavedJobsStore } from '@/domain/saved-jobs';

interface SaveJobButtonProps {
  jobId: string;
  className?: string;
}

export function SaveJobButton({ jobId, className }: SaveJobButtonProps) {
  const candidate = useSessionStore((s) => s.candidate);
  const signInAsDemoCandidate = useSessionStore((s) => s.signInAsDemoCandidate);
  // Subscribe to the store directly so agent-driven saves re-render this button instantly.
  useSavedJobsStore((s) => (candidate ? s.savedByCandidate[candidate.id] : s.savedByCandidate));

  const saved = candidate ? isJobSaved(candidate.id, jobId) : false;

  const handleClick = () => {
    if (!candidate) {
      // Explicit human click: sign in as the demo candidate, then save. No silent sessions.
      const signedIn = signInAsDemoCandidate();
      setJobSaved(signedIn.id, jobId, true);
      return;
    }
    setJobSaved(candidate.id, jobId, !saved);
  };

  return (
    <Button
      type="button"
      variant={saved ? 'secondary' : 'outline'}
      onClick={handleClick}
      className={cn('gap-2', className)}
      data-testid="save-job-button"
      data-saved={saved ? 'true' : 'false'}
      title={candidate ? undefined : 'Sign in to save jobs'}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {candidate ? (saved ? 'Saved' : 'Save job') : 'Sign in & save'}
    </Button>
  );
}
