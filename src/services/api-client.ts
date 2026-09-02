// Basic API client for server-side requests

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error: string | null;
}

export const apiClient = {
  async get<T = any>(url: string): Promise<ApiResponse<T>> {
    // Mock implementation - replace with actual HTTP client
    return { data: {} as T, success: true, error: null };
  },

  async post<T = any>(url: string, data: any): Promise<ApiResponse<T>> {
    // Mock implementation - replace with actual HTTP client
    return { data: {} as T, success: true, error: null };
  },

  async put<T = any>(url: string, data: any): Promise<ApiResponse<T>> {
    // Mock implementation - replace with actual HTTP client
    return { data: {} as T, success: true, error: null };
  },

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    // Mock implementation - replace with actual HTTP client
    return { data: {} as T, success: true, error: null };
  },
};
