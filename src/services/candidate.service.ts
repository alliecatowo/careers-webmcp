
import { CandidateStage } from "@/modules/candidates/candidates.types";
import { adapter } from './adapter';
import { TableQuery } from "@/components/system/DataTable";

export const candidateService = {
  getCandidates: (params: TableQuery) => adapter.getCandidates(params),
  getById: (id: string) => adapter.getCandidateById(id),
  getLatestCandidates: (limit: number) => adapter.getLatestCandidates(limit),
  updateStatus: (id: string, stage: CandidateStage) => adapter.updateCandidateStatus(id, stage),
  create: (candidateData: any) => adapter.createCandidate(candidateData),
  getCandidateProfile: (id: string) => adapter.getCandidateProfile(id),
};
