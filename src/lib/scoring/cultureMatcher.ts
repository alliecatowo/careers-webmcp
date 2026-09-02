import type { Candidate, Job } from '@/types';
import { calculateSkillScore } from './skillMatcher';

export function calculateCultureScore(candidate: Candidate, job: Job): number {
    // Mock logic for "culture fit"
    const experience = candidate.parsedData?.workExperience || [];
    const totalExperienceYears = (candidate.parsedData?.totalExperienceMonths || 0) / 12;

    // Check for "job hopping" - simple version: average duration per job < 1.5 years
    const averageDurationMonths = experience.length > 0
        ? experience.reduce((acc: number, exp: any) => acc + (exp.durationMonths || 0), 0) / experience.length
        : 0;
    const isJobHopper = experience.length > 2 && averageDurationMonths < 18;

    const skillScore = calculateSkillScore(candidate, job);

    if (!isJobHopper && totalExperienceYears >= 2 && skillScore > 60) {
        return 100;
    }

    if (!isJobHopper || totalExperienceYears >= 2) {
        return 70;
    }

    return 40;
}
