
import { apiClient } from "@/services/api-client";
import { ProjectService } from "@/modules/projects/services/project.service";
import { Project, ProjectStatus } from "@/modules/projects/domain/project.entity";
import { TableQuery, PaginatedResponse } from "@/components/system/DataTable";

export const projectServerService: ProjectService = {
    async getProjects(query: TableQuery): Promise<PaginatedResponse<Project>> {
        const params = new URLSearchParams(query as any).toString();
        const response = await apiClient.get(`/projects?${params}`);
        if (!response.success) throw new Error(response.error || "Failed to fetch projects");
        return response.data || { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    },
    async getProjectById(id: string): Promise<Project | undefined> {
        const response = await apiClient.get(`/projects/${id}`);
        if (!response.success) return undefined;
        return response.data || undefined;
    },
    async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project> {
        const response = await apiClient.put(`/projects/${id}/status`, { status });
        if (!response.success) throw new Error(response.error || "Failed to update project status");
        return response.data!;
    }
};
