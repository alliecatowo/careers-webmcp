
import { Job } from "@/lib/talent-acquisition";
import { formatCurrency } from "@/lib/utils/currency";
import { JobSection } from './JobSection';

interface JobCompensationSectionProps {
    job: Job;
}

export function JobCompensationSection({ job }: JobCompensationSectionProps) {
    
    const renderContent = () => {
        switch(job.salaryVisibility) {
            case 'Public':
                return job.salaryBand 
                    ? `This position has an estimated salary range of ${formatCurrency(parseInt(job.salaryBand.split('-')[0]), job.currency || 'USD')} - ${formatCurrency(parseInt(job.salaryBand.split('-')[1]), job.currency || 'USD')} per year, plus potential equity and bonus.`
                    : 'Compensation details are available upon request.';
            case 'RangeOnly':
                return job.salaryBand
                    ? `This position has an estimated salary range of ${job.salaryBand.split('-')[0]} - ${job.salaryBand.split('-')[1]}.`
                    : 'Compensation details are available upon request.';
            case 'Hidden':
            default:
                return 'Compensation details will be discussed during the interview process. Our packages are competitive and include a comprehensive benefits plan.';
        }
    }

    return (
        <JobSection title="Compensation & Benefits">
            <p className="text-muted-foreground">{renderContent()}</p>
        </JobSection>
    );
}
