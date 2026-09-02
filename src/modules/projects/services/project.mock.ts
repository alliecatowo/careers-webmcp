import {
  Project,
  ProjectStatus,
} from '@/modules/projects/domain/project.entity';
import { ProjectService } from '@/modules/projects/services/project.service';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';
import { mockProjects } from '@/services/mockData';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const projectMockService: ProjectService = {
  async getProjects(query: TableQuery): Promise<PaginatedResponse<Project>> {
    await delay(500);
    const { page = 1, limit = 10, search, sortBy, sortOrder, filters } = query;

    let results = [...mockProjects];

    const searchTerm = filters?.search || search;
    const categoryFilter = filters?.category as string;
    const statusFilter = filters?.status as string;
    const skillFilter = filters?.skill as string;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }
    if (categoryFilter && categoryFilter !== 'All') {
      results = results.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter && statusFilter !== 'All' && statusFilter !== 'ALL') {
      results = results.filter((p) => p.status === statusFilter);
    }
    if (skillFilter && skillFilter !== 'All') {
      results = results.filter((p) => p.requiredSkills.includes(skillFilter));
    }

    if (sortBy) {
      results.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = results.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = results.slice(start, end);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },
  async getProjectById(id: string): Promise<Project | undefined> {
    await delay(200);
    return mockProjects.find((p) => p.id === id);
  },
  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
  ): Promise<Project> {
    await delay(300);
    const projectIndex = mockProjects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }
    mockProjects[projectIndex].status = status;
    return mockProjects[projectIndex];
  },
};
