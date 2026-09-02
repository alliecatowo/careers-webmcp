
export type Department = {
  id: string;
  name: string;
  businessUnit: string;
  supportedCountryIds: string[];
  leadershipOwner?: string;
  costCenterCode?: string;
  isActive: boolean;
  displayOrder: number;
};
