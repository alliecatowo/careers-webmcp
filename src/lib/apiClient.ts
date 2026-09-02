
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: string | null;
}

// In a real application, this would be a more robust client, potentially using a library like Axios.
// It would handle headers, authentication tokens, interceptors, and more advanced error handling.
export const apiClient = {
  async get<T>(url: string, tenantId?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (tenantId) {
          headers['X-Tenant-ID'] = tenantId;
      }
      const res = await fetch(`/api${url}`, { headers });
      if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown network error occurred';
      return { success: false, data: null, error: message };
    }
  },

  async post<T>(url: string, body: any, tenantId?: string): Promise<ApiResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (tenantId) {
          headers['X-Tenant-ID'] = tenantId;
      }
      const res = await fetch(`/api${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown network error occurred';
      return { success: false, data: null, error: message };
    }
  },
  
   async put<T>(url: string, body: any): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`/api${url}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown network error occurred';
      return { success: false, data: null, error: message };
    }
  },

  async delete<T>(url: string, body?: any): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`/api${url}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
       if (!res.ok) throw new Error(`API request failed: ${res.statusText}`);
      return await res.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown network error occurred';
      return { success: false, data: null, error: message };
    }
  },
};
