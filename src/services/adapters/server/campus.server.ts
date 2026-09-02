import { apiClient } from '@/services/api-client';
import { TableQuery } from '@/components/system/DataTable';
import { Student } from '@/modules/students/domain/student.entity';

export const campusServerService = {
  async getAIMatches(query: TableQuery) {
    const response = await apiClient.get(
      `/campus/ai-matches?${new URLSearchParams(query as any)}`,
    );
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch AI matches');
    return response.data || [];
  },

  async getRecentPlacements(limit: number): Promise<Student[]> {
    const response = await apiClient.get(
      `/campus/recent-placements?limit=${limit}`,
    );
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch recent placements');
    return response.data || [];
  },
};
