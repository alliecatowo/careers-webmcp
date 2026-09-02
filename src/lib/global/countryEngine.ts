import { COUNTRY_CONFIG, CountryConfig } from '@/config/countries';

/**
 * Retrieves the configuration for a given country code.
 * @param countryCode - The ISO 3166-1 alpha-2 country code (e.g., 'US', 'IN').
 * @returns The configuration object for the country, or undefined if not found.
 */
export function getCountryConfig(countryCode: string): CountryConfig | undefined {
  return COUNTRY_CONFIG[countryCode];
}

/**
 * Mocks detecting the user's country. In a real app, this could be from their profile,
 * IP geolocation, or browser settings.
 * @returns A mock country code.
 */
export function getMockUserCountry(): string {
  // For this mock, we'll just return a default.
  return 'US';
}
