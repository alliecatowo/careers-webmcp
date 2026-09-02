import { apiClient } from '@/services/api-client';
import { ProjectService } from './project.service';
import { TableQuery } from '@/components/system/DataTable';
import { ProjectStatus } from '@/modules/projects/domain/project.entity';

export const projectServerService: ProjectService = {
  async getProjects(query: TableQuery) {
    const params = new URLSearchParams(query as any).toString();
    const response = await apiClient.get(`/projects?${params}`);
    return {
      data: response.data || [],
      total: 0,
      page: query.page || 1,
      limit: query.limit || 10,
      totalPages: 0,
    };
  },
  async getProjectById(id: string) {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  async updateProjectStatus(id: string, status: ProjectStatus) {
    const response = await apiClient.put(`/projects/${id}/status`, { status });
    return response.data;
  },
};
