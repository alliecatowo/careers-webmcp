
import { Country, Department, Job, ComplianceProfile, PaginatedResponse } from "@/lib/talent-acquisition";
import { mockJobs } from '@/mocks/talent-platform/jobs.mock';
import { mockCountries } from '@/mocks/talent-platform/countries.mock';
import { mockDepartments } from '@/mocks/talent-platform/departments.mock';
import { mockComplianceProfiles } from '@/mocks/talent-platform/compliance.mock';
import { getRolesByCountry as getRolesByCountryData } from '@/mocks/talent-platform/roles.mock';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const talentMockService = {
  // COUNTRIES
  async getCountries(filters: { isActive?: boolean } = {}): Promise<Country[]> {
    await delay(100);
    let filteredCountries = mockCountries;
    if (filters.isActive) {
      filteredCountries = filteredCountries.filter(c => c.isActive);
    }
    return filteredCountries.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async getCountryBySlug(slug: string): Promise<Country | undefined> {
    await delay(50);
    return mockCountries.find(c => c.slug === slug && c.isActive);
  },
  
  async getCountryById(id: string): Promise<Country | undefined> {
    await delay(50);
    return mockCountries.find(c => c.id === id);
  },

  // DEPARTMENTS
  async getDepartments(filters: { isActive?: boolean, countryId?: string } = {}): Promise<Department[]> {
    await delay(100);
    let filteredDepts = mockDepartments;
    if (filters.isActive) {
      filteredDepts = filteredDepts.filter(d => d.isActive);
    }
    if (filters.countryId) {
      filteredDepts = filteredDepts.filter(d => d.supportedCountryIds.includes(filters.countryId as string));
    }
    return filteredDepts.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  // JOBS
  async getJobs(filters: { status?: string; visibility?: 'public'; countryId?: string; departmentId?: string; department?: string; employmentType?: any; q?: string; search?: string; page?: number; limit?: number } = {}): Promise<PaginatedResponse<Job>> {
    await delay(350);
    let filteredJobs = [...mockJobs];

    if (filters.status && filters.status !== 'all') {
      filteredJobs = filteredJobs.filter(j => j.status === filters.status);
    }
     if (filters.visibility) {
      filteredJobs = filteredJobs.filter(j => j.visibility === filters.visibility);
    }
    if (filters.countryId && filters.countryId !== 'all') {
        filteredJobs = filteredJobs.filter(j => j.countryId === filters.countryId);
    }
     if (filters.departmentId && filters.departmentId !== 'all') {
        filteredJobs = filteredJobs.filter(j => j.departmentId === filters.departmentId);
    }
    if (filters.employmentType && filters.employmentType !== 'all') {
        filteredJobs = filteredJobs.filter(j => j.employmentType === filters.employmentType);
    }

    const searchTerm = filters.q || filters.search;
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredJobs = filteredJobs.filter(j => j.title.toLowerCase().includes(term) || j.description.toLowerCase().includes(term));
    }
    
    if (filters.department && filters.department !== 'all') {
        const department = mockDepartments.find(d => d.name === filters.department);
        if (department) {
            filteredJobs = filteredJobs.filter(j => j.departmentId === department.id);
        }
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const total = filteredJobs.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const sortedJobs = filteredJobs.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const paginatedData = sortedJobs.slice(start, end);

    return {
        data: paginatedData,
        total,
        page,
        limit,
        totalPages
    };
  },
  
  async getJobById(id: string): Promise<Job | undefined> {
    await delay(50);
    return mockJobs.find(j => j.id === id);
  },

  // COMPLIANCE
  async getComplianceProfile(id: string): Promise<ComplianceProfile | undefined> {
    await delay(50);
    return mockComplianceProfiles.find(p => p.id === id);
  },
  
  async getRolesByCountry(slug: string): Promise<any[]> {
    await delay(50);
    return getRolesByCountryData(slug);
  }
};
