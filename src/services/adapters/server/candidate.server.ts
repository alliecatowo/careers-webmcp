
import { apiClient } from "@/lib/apiClient";
import { CandidatesQueryParams, CandidateStage } from "@/modules/candidates/candidates.types";

export const candidateServerService = {
    getCandidates: (params: CandidatesQueryParams) => {
        const queryParams = {
            page: params.page?.toString(),
            limit: params.limit?.toString(),
            search: params.search,
            stage: params.stage,
        };
        const filteredParams = Object.entries(queryParams).reduce((acc, [key, value]) => {
            if (value) acc[key] = value;
            return acc;
        }, {} as Record<string, string>);

        const query = new URLSearchParams(filteredParams).toString();
        return apiClient.get(`/candidates?${query}`);
    },
    
    getById: (id: string) => apiClient.get(`/candidates/${id}`),

    updateStatus: (id: string, stage: CandidateStage) => apiClient.put(`/candidates/${id}/status`, { stage }),

    create: (data: any) => apiClient.post('/candidates', data),
    
    getLatestCandidates: (limit: number = 5) => apiClient.get(`/candidates?sort=latest&limit=${limit}`),
};
