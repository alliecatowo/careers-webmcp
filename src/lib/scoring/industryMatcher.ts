import type { Candidate, Job } from '@/types';

// Mock keywords for departments
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
    'Engineering': ['software', 'tech', 'develop', 'engineer'],
    'Product': ['product', 'feature', 'roadmap', 'growth'],
    'Design': ['design', 'ux', 'ui', 'figma', 'user experience'],
    'Marketing': ['marketing', 'growth', 'seo', 'campaign', 'brand'],
}

export function calculateIndustryScore(candidate: Candidate, job: Job): number {
    const keywords = INDUSTRY_KEYWORDS[job.departmentId] || [];
    if (keywords.length === 0) return 50;

    const experienceText = (candidate.parsedData?.workExperience || [])
        .map((exp: any) => `${exp.role} ${exp.company}`)
        .join(' ')
        .toLowerCase();

    for (const keyword of keywords) {
        if (experienceText.includes(keyword)) {
            return 100;
        }
    }

    return 50;
}
