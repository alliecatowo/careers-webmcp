
export type Country = {
  id: string;
  isoCode: string;
  name: string;
  slug: string;
  region: 'APAC' | 'North America' | 'Europe';
  type: 'headquarters' | 'strategic-hub' | 'distributed';
  hiringModel: 'full-scale' | 'selective' | 'remote-first';
  stateFilterEnabled: boolean;
  states?: string[];
  overview: string;
  timezone: string;
  currency: string;
  complianceProfileId: string;
  isActive: boolean;
  displayOrder: number;
};
