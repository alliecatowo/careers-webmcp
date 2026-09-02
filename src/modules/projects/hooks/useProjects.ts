
'use client';

import useSWR from 'swr';
import { projectService } from '@/services/project.service';
import { ProjectFilters } from '../services/project.service';

export const useProjects = (filters: ProjectFilters) => {
    const key = `projects?${JSON.stringify(filters)}`;
    const { data, error, isLoading } = useSWR(key, () => projectService.getProjects({ page: 1, limit: 100, filters }), {
        refreshInterval: 2000 // Poll for changes every 2 seconds
    });

    return {
        projects: data?.data,
        isLoading,
        isError: error
    };
};
