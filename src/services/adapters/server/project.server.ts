import { apiClient } from '@/lib/apiClient';
import { ProjectService } from '@/modules/projects/services/project.service';
import {
  Project,
  ProjectStatus,
} from '@/modules/projects/domain/project.entity';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';

export const projectServerService: ProjectService = {
  async getProjects(query: TableQuery): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams(query as any).toString();
    const response = await apiClient.get<PaginatedResponse<Project>>(
      `/projects?${params}`,
    );
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch projects');
    return response.data as PaginatedResponse<Project>;
  },
  async getProjectById(id: string): Promise<Project | undefined> {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    if (!response.success) return undefined;
    return (response.data as Project) || undefined;
  },
  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
  ): Promise<Project> {
    const response = await apiClient.put<Project>(`/projects/${id}/status`, {
      status,
    });
    if (!response.success)
      throw new Error(response.error || 'Failed to update project status');
    return response.data as Project;
  },
};
