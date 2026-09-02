
import { PaginatedResponse } from '@/components/system/DataTable';
import { Job } from '@/lib/talent-acquisition';
import { adapter } from './adapter';

export const talentService = {
  getCountries: (filters: { isActive?: boolean } = {}) => adapter.getTalentCountries(filters),
  getCountryBySlug: (slug: string) => adapter.getTalentCountryBySlug(slug),
  getCountryById: (id: string) => adapter.getTalentCountryById(id),
  getDepartments: (filters: { isActive?: boolean, countryId?: string } = {}) => adapter.getTalentDepartments(filters),
  getJobs: (filters: any = {}): Promise<PaginatedResponse<Job>> => adapter.getTalentJobs(filters),
  getJobById: (id: string) => adapter.getTalentJobById(id),
  getComplianceProfile: (id: string) => adapter.getTalentComplianceProfile(id),
  getRolesByCountry: (slug: string) => adapter.getTalentRolesByCountry(slug),
};
