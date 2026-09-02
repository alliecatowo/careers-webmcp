
import { Project, ProjectStatus } from '../domain/project.entity';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';

export interface ProjectFilters {
    search?: string;
    category?: string;
    status?: string;
    skill?: string;
}

export interface ProjectService {
    getProjects(query: TableQuery): Promise<PaginatedResponse<Project>>;
    getProjectById(id: string): Promise<Project | undefined>;
    updateProjectStatus(id: string, status: ProjectStatus): Promise<Project>;
}
