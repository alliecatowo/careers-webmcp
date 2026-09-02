export interface CountrySpecificConfig {
  countryCode: string; // e.g., 'IN', 'US', 'PL'
  isPublished: boolean;
  complianceTextId?: string;
  visaSponsorshipAvailable: boolean;
  workAuthorizationRequired: boolean;
}
