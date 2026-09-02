
export type CountryConfig = {
  currency: string;
  timezone: string;
  region: 'NA' | 'EU' | 'APAC' | 'LATAM' | 'MEA';
  salaryMultiplier: number;
};

export const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  US: {
    currency: 'USD',
    timezone: 'America/New_York',
    region: 'NA',
    salaryMultiplier: 1.0,
  },
  IN: {
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    region: 'APAC',
    salaryMultiplier: 0.6,
  },
  GB: {
    currency: 'GBP',
    timezone: 'Europe/London',
    region: 'EU',
    salaryMultiplier: 0.95,
  },
  AU: {
    currency: 'AUD',
    timezone: 'Australia/Sydney',
    region: 'APAC',
    salaryMultiplier: 0.85,
  },
  PL: {
    currency: 'PLN',
    timezone: 'Europe/Warsaw',
    region: 'EU',
    salaryMultiplier: 0.7
  },
  CA: {
      currency: 'CAD',
      timezone: 'America/Toronto',
      region: 'NA',
      salaryMultiplier: 0.9
  },
  VN: {
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    region: 'APAC',
    salaryMultiplier: 0.5,
  },
  PH: {
    currency: 'PHP',
    timezone: 'Asia/Manila',
    region: 'APAC',
    salaryMultiplier: 0.55,
  },
  UA: {
    currency: 'UAH',
    timezone: 'Europe/Kyiv',
    region: 'EU',
    salaryMultiplier: 0.65,
  },
};

export const SUPPORTED_COUNTRIES = Object.keys(COUNTRY_CONFIG);
