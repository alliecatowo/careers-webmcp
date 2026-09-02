import { apiClient } from '@/lib/apiClient';
import { TeamMember } from '@/lib/team.data';

export const teamServerService = {
  async getTeamMembers(): Promise<TeamMember[]> {
    const response = await apiClient.get<TeamMember[]>('/team-members');
    return response.data as TeamMember[];
  },
  async getTeamMemberById(id: string): Promise<TeamMember | undefined> {
    const response = await apiClient.get<TeamMember>(`/team-members/${id}`);
    return response.data as TeamMember | undefined;
  },
  createTeamMember: (data: Omit<TeamMember, 'id'>) => {
    return apiClient.post('/team-members', data);
  },
  updateTeamMember: (id: string, data: Partial<TeamMember>) => {
    return apiClient.put(`/team-members/${id}`, data);
  },
  deleteTeamMember: (id: string) => {
    return apiClient.delete(`/team-members/${id}`);
  },
};
