import { DashboardService } from './dashboard.service';

export const ApiDashboardService: DashboardService = {
  async getDashboardData() {
    // In a real app, this would fetch from an API endpoint
    // const res = await fetch('/api/dashboard/stats');
    // if (!res.ok) throw new Error('Failed to fetch dashboard data');
    // return res.json();
    throw new Error('API service not implemented');
  },
};
