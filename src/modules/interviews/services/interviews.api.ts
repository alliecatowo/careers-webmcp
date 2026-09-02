import { apiClient } from '@/services/api-client';
import { Interview, InterviewStatus } from '../domain/interview.entity';

// This is a placeholder for the real API service.
// The methods are named to match the mock service for adapter compatibility.
export const interviewsServerService = {
  async getAllInterviews(): Promise<Interview[]> {
    const response = await apiClient.get('/interviews');
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch interviews');
    return response.data || [];
  },

  async schedule(
    data: Omit<Interview, 'id' | 'createdAt' | 'status'>,
  ): Promise<Interview> {
    const response = await apiClient.post('/interviews', data);
    if (!response.success)
      throw new Error(response.error || 'Failed to schedule interview');
    return response.data!;
  },

  async updateStatus(id: string, status: InterviewStatus): Promise<void> {
    const response = await apiClient.put(`/interviews/${id}/status`, {
      status,
    });
    if (!response.success)
      throw new Error(response.error || 'Failed to update interview status');
  },

  async submitFeedback(
    id: string,
    feedback: string,
    rating: number,
  ): Promise<void> {
    const response = await apiClient.post(`/interviews/${id}/feedback`, {
      feedback,
      rating,
    });
    if (!response.success)
      throw new Error(response.error || 'Failed to submit feedback');
  },
};
