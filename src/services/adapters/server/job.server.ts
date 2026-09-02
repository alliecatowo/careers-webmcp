
import { apiClient } from "@/lib/apiClient";
import { JobFormData } from "@/types";
import { JobsQueryParams } from "@/modules/jobs/jobs.types";

export const jobServerService = {
    async getAllJobs() {
        return apiClient.get(`/jobs/all`);
    },
    async getJobs(params: JobsQueryParams) {
        const query = new URLSearchParams(params as any).toString();
        return apiClient.get(`/jobs?${query}`);
    },
    async getById(id: string) {
        return apiClient.get(`/jobs/${id}`);
    },
    async create(data: JobFormData) {
        return apiClient.post("/jobs", data);
    },
    async update(id: string, data: JobFormData) {
        return apiClient.put(`/jobs/${id}`, data);
    },
    async delete(id: string) {
        return apiClient.delete(`/jobs/${id}`);
    },
    async fetchLatestJobs(limit: number = 5) {
        return apiClient.get(`/jobs?sort=latest&limit=${limit}`);
    },
    async getApplicationsForJob(jobId: string) {
        return apiClient.get(`/jobs/${jobId}/applications`);
    },
};
