import type { Candidate, Job } from '@/types';

function parseExperienceYears(expString: string): number {
  if (!expString) return 0;
  const match = expString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function calculateExperienceScore(
  candidate: Candidate,
  job: Job,
): number {
  const requiredMonths =
    parseExperienceYears(job.experienceRequired || '0') * 12;
  if (requiredMonths === 0) {
    return 100; // No experience requirement specified.
  }

  const candidateMonths = candidate.parsedData?.totalExperienceMonths || 0;

  if (candidateMonths >= requiredMonths) {
    return 100;
  }

  const ratio = candidateMonths / requiredMonths;

  if (ratio >= 0.8) {
    return 75;
  }
  if (ratio >= 0.6) {
    return 50;
  }

  return 25;
}
