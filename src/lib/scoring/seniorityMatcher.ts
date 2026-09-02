import type { Candidate, Job } from '@/types';

type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Mid-Senior';
const levels: SeniorityLevel[] = ['Junior', 'Mid', 'Mid-Senior', 'Senior', 'Lead'];

function getSeniorityFromMonths(months: number): SeniorityLevel {
    if (months < 24) return 'Junior';
    if (months < 60) return 'Mid';
    if (months < 96) return 'Mid-Senior';
    if (months < 120) return 'Senior';
    return 'Lead';
}

export function calculateSeniorityScore(candidate: Candidate, job: Job): number {
    const jobSeniority = job.seniorityLevel as SeniorityLevel;
    if (!jobSeniority || !levels.includes(jobSeniority)) {
        return 100; // No specific seniority level, assume it's a match.
    }

    const candidateMonths = candidate.parsedData?.totalExperienceMonths || 0;
    const candidateSeniority = getSeniorityFromMonths(candidateMonths);

    if (candidateSeniority === jobSeniority) {
        return 100;
    }

    const jobIndex = levels.indexOf(jobSeniority);
    const candidateIndex = levels.indexOf(candidateSeniority);
    const diff = Math.abs(jobIndex - candidateIndex);

    if (diff === 1) {
        return 70;
    }

    return 40;
}
