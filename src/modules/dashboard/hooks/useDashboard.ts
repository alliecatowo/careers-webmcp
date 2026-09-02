'use client';

import useSWR from 'swr';
import { dashboardService } from '../services/dashboard.adapter';

export const useDashboard = () => {
    // SWR will fetch the data and handle caching, revalidation, etc.
    const { data, error, isLoading } = useSWR('dashboardData', dashboardService.getDashboardData);

    return {
        data,
        isLoading,
        isError: !!error,
    };
};
