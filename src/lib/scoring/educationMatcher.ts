import type { Candidate, Job } from '@/types';

export function calculateEducationScore(candidate: Candidate, job: Job): number {
    // Mock implementation as requested.
    // A real implementation would check job.educationRequirements vs candidate.parsedData.education
    const hasEducation = (candidate.parsedData?.education || []).length > 0;

    if (hasEducation) {
        const degrees = new Set(candidate.parsedData?.education.map((e: any) => e.degree.toLowerCase()));
        if (degrees.has("master's") || degrees.has("phd") || degrees.has("m.s.")) {
            return 100;
        }
        if (degrees.has("bachelor's") || degrees.has("b.s.")) {
            return 80;
        }
        return 70; // Other education
    }

    return 30; // Low score if no education is parsed.
}
