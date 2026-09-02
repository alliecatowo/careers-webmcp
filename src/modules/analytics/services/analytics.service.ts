
import { AnalyticsData, AnalyticsFilters } from '../domain/analytics.entity';

export interface AnalyticsService {
  getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsData>;
}
