
import { Job } from "@/lib/talent-acquisition";
import { formatCurrency } from "@/lib/utils/currency";
import { Badge } from "@/components/ui/badge";
import { JobSection } from './JobSection';

interface JobCompensationSectionProps {
    job: Job;
}

function compensationRange(job: Job): { min: number; max: number } | null {
    if (typeof job.salaryMin === 'number' && typeof job.salaryMax === 'number') {
        return { min: job.salaryMin, max: job.salaryMax };
    }
    if (job.salaryBand) {
        const parts = job.salaryBand.split('-').map((p) => parseInt(p.replace(/[^0-9]/g, ''), 10));
        if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
            return { min: parts[0], max: parts[1] };
        }
    }
    return null;
}

export function JobCompensationSection({ job }: JobCompensationSectionProps) {
    const range = compensationRange(job);

    const renderContent = () => {
        switch(job.salaryVisibility) {
            case 'Public':
                return range
                    ? `This position has an estimated salary range of ${formatCurrency(range.min, job.currency || 'USD')} - ${formatCurrency(range.max, job.currency || 'USD')} per year, plus potential equity and bonus.`
                    : 'Compensation details are available upon request.';
            case 'RangeOnly':
                return range
                    ? `This position has an estimated salary range of ${range.min} - ${range.max}.`
                    : 'Compensation details are available upon request.';
            case 'Hidden':
            default:
                return 'Compensation details will be discussed during the interview process. Our packages are competitive and include a comprehensive benefits plan.';
        }
    }

    return (
        <JobSection title="Compensation & Benefits">
            <p className="text-muted-foreground">{renderContent()}</p>
            {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2">Key skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </JobSection>
    );
}
