
import { Department } from "@/lib/talent-acquisition";

export const mockDepartments: Department[] = [
  { id: 'dept_eng_it', name: 'Engineering / IT / Software', businessUnit: 'Technology', supportedCountryIds: ['country_in', 'country_us', 'country_gb', 'country_ca', 'country_pl', 'country_vn', 'country_ua'], isActive: true, displayOrder: 1 },
  { id: 'dept_sales', name: 'Sales & Marketing', businessUnit: 'Growth', supportedCountryIds: ['country_in', 'country_us', 'country_ca', 'country_au', 'country_vn'], isActive: true, displayOrder: 2 },
  { id: 'dept_hr', name: 'HR & Talent Acquisition', businessUnit: 'People', supportedCountryIds: ['country_in', 'country_us', 'country_ca', 'country_pl'], isActive: true, displayOrder: 3 },
  { id: 'dept_ops', name: 'Operations / Logistics', businessUnit: 'Operations', supportedCountryIds: ['country_in', 'country_ca', 'country_au'], isActive: true, displayOrder: 4 },
  { id: 'dept_finance', name: 'Finance / Accounting', businessUnit: 'Corporate', supportedCountryIds: ['country_in', 'country_us', 'country_pl', 'country_ph'], isActive: true, displayOrder: 5 },
  { id: 'dept_legal', name: 'Legal & Compliance', businessUnit: 'Corporate', supportedCountryIds: ['country_in', 'country_us', 'country_gb'], isActive: true, displayOrder: 6 },
  { id: 'dept_rd', name: 'R&D / Innovation Labs', businessUnit: 'Technology', supportedCountryIds: ['country_in', 'country_pl', 'country_ua'], isActive: true, displayOrder: 7 },
  { id: 'dept_prod', name: 'Engineering / Product Development', businessUnit: 'Technology', supportedCountryIds: ['country_us', 'country_gb'], isActive: true, displayOrder: 8 },
  { id: 'dept_mktg', name: 'Marketing & Communications', businessUnit: 'Growth', supportedCountryIds: ['country_us', 'country_gb'], isActive: true, displayOrder: 9 },
  { id: 'dept_support', name: 'Customer Success / Support', businessUnit: 'Operations', supportedCountryIds: ['country_us', 'country_gb', 'country_pl', 'country_au', 'country_vn', 'country_ph'], isActive: true, displayOrder: 10 },
  { id: 'dept_design', name: 'Design', businessUnit: 'Technology', supportedCountryIds: ['country_ua'], isActive: true, displayOrder: 11 },
];
