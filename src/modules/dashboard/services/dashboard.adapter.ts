
import { dashboardMockService } from './dashboard.mock';
import { DashboardService } from './dashboard.service';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// The ApiDashboardService would be the real implementation.
const ApiDashboardService: DashboardService = {
  async getDashboardData() {
    // This would fetch from your live backend API
    // e.g., return apiClient.get('/dashboard');
    throw new Error('API service not implemented');
  },
};

export const dashboardService = USE_MOCK
  ? dashboardMockService
  : ApiDashboardService;
