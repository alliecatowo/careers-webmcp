
import { ApplicationStatus, ApplicationWithCandidate, MultiPhaseApplicationData } from '@/types';
import { apiClient } from '@/lib/apiClient';
import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import { adapter } from './adapter';

export const applicationService = {
  async submitMultiPhaseApplication(countrySlug: string, data: MultiPhaseApplicationData): Promise<{ success: boolean; applicationId: string; }> {
      const response = await apiClient.post<{ applicationId: string }>(`/api/${countrySlug}/application`, data);
      if (!response.success || !response.data) {
          throw new Error(response.error || 'Multi-phase application submission failed');
      }
      return { success: true, applicationId: response.data.applicationId };
  },

  async getApplications(query: TableQuery): Promise<PaginatedResponse<ApplicationWithCandidate>> {
    return adapter.getApplications(query);
  },

  async getDetailedApplication(id: string): Promise<MultiPhaseApplicationData | null> {
    const response = await apiClient.get<MultiPhaseApplicationData>(`/api/applications/${id}`);
    if (!response.success) {
      console.error(response.error);
      return null;
    }
    return response.data;
  },

  getApplicationDetails(id: string) {
    return adapter.getApplicationDetails(id);
  },
  updateApplicationStatus(id: string, status: ApplicationStatus) {
    return adapter.updateApplicationStatus(id, status);
  },
  getApplicationsForUser(userId: string) {
    return adapter.getApplicationsForUser(userId);
  },
  scheduleInterview(applicationId: string, dateTime: string) {
    return adapter.scheduleInterview(applicationId, dateTime);
  },
  sendOffer(applicationId: string) {
    return adapter.sendOffer(applicationId);
  },
  rejectApplication(applicationId: string) {
    return adapter.rejectApplication(applicationId);
  }
};
