
import { Candidate, CandidateStage } from "@/modules/candidates/candidates.types";

export let candidates: Candidate[] =
  Array.from({ length: 50 }).map((_, i) => ({
    id: String(i + 1),
    name: `Candidate ${i + 1}`,
    email: `candidate${i + 1}@mail.com`,
    phone: "999-999-9999",
    jobTitle: i % 5 === 0 ? "Lead Product Designer" : "Frontend Engineer",
    experienceYears: Math.floor(Math.random() * 8) + 1,
    stage: (["APPLIED","SCREENING","INTERVIEW","OFFER"] as CandidateStage[])[i % 4],
    rating: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: i % 3 === 0 ? 'org_stark' : 'org_acme',
    avatarUrl: `https://i.pravatar.cc/150?u=candidate${i + 1}`
  }));

export function getAllCandidates(): Candidate[] {
    return candidates;
}

export function addCandidate(candidate: Candidate): void {
    candidates.unshift(candidate);
}
