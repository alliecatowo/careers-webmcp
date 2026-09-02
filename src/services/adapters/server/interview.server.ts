
import { apiClient } from "@/lib/apiClient";

export const interviewServerService = {
    getAllInterviews: () => apiClient.get("/interviews"),
    getInterviewsForCandidate: (candidateId: string) => apiClient.get(`/candidates/${candidateId}/interviews`),
};
