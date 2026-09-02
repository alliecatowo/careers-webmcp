import type { Candidate, Job } from '@/types';

export function calculateLocationScore(candidate: Candidate, job: Job): number {
  if (job.remoteAllowed) {
    // A more complex system could map candidate country to allowed remote regions.
    // For now, if remote is allowed, we score highly.
    return 100;
  }

  if (candidate.country === job.countryId) {
    return 100;
  }

  return 40;
}
