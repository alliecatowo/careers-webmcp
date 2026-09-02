'use client';

import { talentService } from "@/services/talent.service";
import { Department, Job } from "@/lib/talent-acquisition";
import useSWR from 'swr';
import { useTenant } from "@/context/TenantContext";
import { PaginatedResponse } from "@/components/system/DataTable";

export interface AdminJobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department?: string;
}

// Create a stable key for SWR based on query params and tenant.
const getAdminJobsKey = (params: AdminJobsQueryParams, tenantId: string | null) => {
    if (!tenantId) return null;
    const { page = 1, limit = 10, ...rest } = params;
    const sortedFilters = Object.entries(rest).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    // Use a stable key representation
    return `admin/jobs/tenant=${tenantId}/page=${page}&limit=${limit}&${JSON.stringify(sortedFilters)}`;
};

export const useAdminJobs = (params: AdminJobsQueryParams) => {
    const { currentOrganization } = useTenant();
    
    // The fetcher now directly calls the service with filters
    const fetcher = async () => {
        if (!currentOrganization) {
            // Return the correct shape for PaginatedResponse
            return { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };
        }
        return await talentService.getJobs(params);
    };

    // Separate SWR call for departments since it's static data
    const departmentsFetcher = () => talentService.getDepartments({});
    
    const { data: jobsResponse, error: jobsError, isLoading: jobsLoading, mutate: mutateJobs } = useSWR(
        getAdminJobsKey(params, currentOrganization?.id || null), 
        fetcher
    );
    
    const { data: allDepartments, error: deptsError } = useSWR('allDepartments', departmentsFetcher);

    // Combine the results for the component
    const responseData = jobsResponse ? {
        ...jobsResponse,
        allDepartments: allDepartments || [],
    } : undefined;

    return { 
        data: responseData, 
        isLoading: jobsLoading || !allDepartments, 
        isError: jobsError || deptsError,
        mutate: mutateJobs,
    };
};
