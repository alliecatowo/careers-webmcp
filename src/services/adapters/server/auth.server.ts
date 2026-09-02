import { apiClient } from '@/lib/apiClient';

export const authServerService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout', {});
  },
  checkSession: async (): Promise<{
    isAuthenticated: boolean;
    userId: string | null;
  }> => {
    const response = await apiClient.get('/auth/session');
    return response.data as { isAuthenticated: boolean; userId: string | null };
  },
};
