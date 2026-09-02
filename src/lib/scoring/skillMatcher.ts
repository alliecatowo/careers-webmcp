import type { Job, Candidate } from '@/types';

export function calculateSkillScore(candidate: Candidate, job: Job): number {
  const requiredSkills = job.requiredSkills || [];
  if (requiredSkills.length === 0) {
    return 100; // No specific skills required, so 100% match.
  }

  const candidateSkills = new Set([
    ...(candidate.parsedData?.skills || []),
    ...(candidate.parsedData?.technologies || []),
  ].map(s => s.toLowerCase()));

  let matchCount = 0;
  for (const required of requiredSkills) {
    if (candidateSkills.has(required.toLowerCase())) {
      matchCount++;
    }
  }

  return (matchCount / requiredSkills.length) * 100;
}
