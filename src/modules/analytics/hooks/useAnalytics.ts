'use client';

import useSWR from 'swr';
import { analyticsService } from '../services/analytics.adapter';
import { AnalyticsFilters, AnalyticsData } from '../domain/analytics.entity';

// Create a stable SWR key so data re-fetches when filters change
const getAnalyticsKey = (filters: AnalyticsFilters) => {
  return ['analyticsDashboard', JSON.stringify(filters)];
};

export const useAnalytics = (filters: AnalyticsFilters) => {

  const { data, error, isLoading } = useSWR<AnalyticsData>(
    getAnalyticsKey(filters),
    async () => {
      const result = await analyticsService.getDashboardData(filters);
      return result as AnalyticsData;
    }
  );

  return {
    data,
    isLoading,
    isError: Boolean(error),
  };
};