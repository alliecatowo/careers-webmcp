
import { adapter } from './adapter';
import { Project, ProjectStatus } from '@/modules/projects/domain/project.entity';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';

export const projectService = {
  getProjects: (query: TableQuery): Promise<PaginatedResponse<Project>> => adapter.getProjects(query),
  getProjectById: (id: string) => adapter.getProjectById(id),
  updateProjectStatus: (id: string, status: ProjectStatus) => adapter.updateProjectStatus(id, status),
};
