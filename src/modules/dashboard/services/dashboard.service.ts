import { DashboardData } from '../domain/dashboard.entity';

export interface DashboardService {
  getDashboardData(): Promise<DashboardData>;
}
