
import { ComplianceProfile } from "@/lib/talent-acquisition";
import { JobSection } from './JobSection';

interface JobComplianceSectionProps {
    compliance: ComplianceProfile;
}

export function JobComplianceSection({ compliance }: JobComplianceSectionProps) {
    return (
        <JobSection title="Compliance Information">
            <div className="text-xs text-muted-foreground space-y-2 p-4 border rounded-lg bg-muted/50">
                <p><strong>Equal Opportunity:</strong> {compliance.equalOpportunityStatement}</p>
                <p><strong>Hiring Disclosure:</strong> {compliance.hiringDisclosureText}</p>
                <p><strong>Labor Law Reference:</strong> {compliance.laborLawReference}</p>
            </div>
        </JobSection>
    );
}
