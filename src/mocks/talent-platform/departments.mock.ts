
import { Department } from "@/lib/talent-acquisition";

export const mockDepartments: Department[] = [
  { id: 'dept_eng_it', name: 'Engineering', businessUnit: 'Technology', supportedCountryIds: ['country_in', 'country_us', 'country_gb', 'country_ca', 'country_pl', 'country_vn', 'country_ua'], isActive: true, displayOrder: 1 },
  { id: 'dept_design', name: 'Design', businessUnit: 'Technology', supportedCountryIds: ['country_us', 'country_ua'], isActive: true, displayOrder: 2 },
  { id: 'dept_product', name: 'Product', businessUnit: 'Technology', supportedCountryIds: ['country_us', 'country_gb'], isActive: true, displayOrder: 3 },
  { id: 'dept_gtm', name: 'Go-to-Market', businessUnit: 'Growth', supportedCountryIds: ['country_us', 'country_gb', 'country_ca', 'country_au', 'country_vn'], isActive: true, displayOrder: 4 },
  { id: 'dept_people', name: 'People', businessUnit: 'People', supportedCountryIds: ['country_us', 'country_in', 'country_ca', 'country_pl'], isActive: true, displayOrder: 5 },
  { id: 'dept_data', name: 'Data', businessUnit: 'Technology', supportedCountryIds: ['country_us', 'country_in'], isActive: true, displayOrder: 6 },
];
