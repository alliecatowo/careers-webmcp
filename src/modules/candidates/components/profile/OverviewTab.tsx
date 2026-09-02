
import { Candidate } from "@/types";
import { AISummaryCard } from "./AISummaryCard";
import { CandidateInfoCard } from "./CandidateInfoCard";
import { SkillsCard } from "./SkillsCard";

interface OverviewTabProps {
    candidate: Candidate;
}

export function OverviewTab({ candidate }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-8">
                <AISummaryCard candidate={candidate} />
                <SkillsCard candidate={candidate} />
            </div>
            <div className="md:col-span-1">
                <CandidateInfoCard candidate={candidate} />
            </div>
        </div>
    );
}
