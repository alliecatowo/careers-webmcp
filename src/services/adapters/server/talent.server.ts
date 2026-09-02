import { apiClient } from "@/lib/apiClient";
import { AppError } from "@/lib/errors";
import { Country } from "@/lib/talent-acquisition";

// This is the server-side implementation that would talk to your real API
export const talentServerService = {
  // COUNTRIES
  async getCountries(filters: { isActive?: boolean } = {}) {
    const response = await apiClient.get<Country[]>(`/api/countries?isActive=${filters.isActive || 'false'}`);
    if (!response.success || !response.data) throw new AppError('Failed to fetch countries', 500);
    return response.data;
  },
  async getCountryBySlug(slug: string) {
    const response = await apiClient.get<Country>(`/api/countries/${slug}`);
    if (!response.success) {
        if (response.error?.includes('not found')) return undefined;
        throw new AppError(response.error || 'Failed to fetch country', 500);
    }
    return response.data || undefined;
  },
  async getCountryById(id: string) {
    // This would likely be a direct API call in a real app, e.g., apiClient.get(`/api/countries/${id}`)
    const countries = await this.getCountries();
    return countries.find((c: any) => c.id === id);
  },
  // DEPARTMENTS
  async getDepartments(filters: { isActive?: boolean, countryId?: string } = {}) {
    const query = new URLSearchParams();
    if (filters.isActive) query.set('isActive', 'true');
    if (filters.countryId) query.set('countryId', filters.countryId);
    
    const response = await apiClient.get(`/api/departments?${query.toString()}`);
    if (!response.success || !response.data) throw new AppError(response.error || 'Failed to fetch departments', 500);
    return response.data;
  },
  // JOBS
  async getJobs(filters: { status?: 'published' | 'draft'; visibility?: 'public'; countryId?: string; employmentType?: any } = {}) {
     const query = new URLSearchParams();
    if (filters.status) query.set('status', filters.status);
    if (filters.visibility) query.set('visibility', filters.visibility);
    if (filters.countryId) query.set('countryId', filters.countryId);
    const response = await apiClient.get(`/api/jobs?${query.toString()}`);
    if (!response.success || !response.data) throw new AppError(response.error || 'Failed to fetch jobs', 500);
    return response.data;
  },
  async getJobById(id: string) {
    const response = await apiClient.get(`/api/jobs/${id}`);
    if (!response.success) {
        if (response.error?.includes('not found')) return undefined;
        throw new AppError(response.error || 'Failed to fetch job', 500);
    }
    return response.data || undefined;
  },
  // COMPLIANCE
  async getComplianceProfile(id: string) {
    const response = await apiClient.get(`/api/compliance-profiles/${id}`);
    if (!response.success) {
        if (response.error?.includes('not found')) return undefined;
        throw new AppError(response.error || 'Failed to fetch compliance profile', 500);
    }
    return response.data || undefined;
  },
  async getRolesByCountry(slug: string) {
    const response = await apiClient.get(`/api/${slug}/roles`);
    if (!response.success || !response.data) throw new AppError(response.error || 'Failed to fetch roles', 500);
    return response.data;
  }
};
