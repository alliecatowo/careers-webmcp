
import { ApplicationStatus } from '@/types';

// Mock configuration for different ATS providers. In a real app, this would be stored
// securely in a database or environment variables.
const providerConfigs = {
  greenhouse: {
    apiKey: 'gh_mock_api_key_12345',
    apiEndpoint: 'https://harvest.greenhouse.io/v1/',
    webhookSignatureKey: 'mock_greenhouse_secret_key',
  },
  lever: {
    apiKey: 'lv_mock_api_key_67890',
    apiEndpoint: 'https://api.lever.co/v1/',
    webhookSignatureKey: 'mock_lever_secret_key',
  },
};

// Defines which ATS provider is used for each country.
const countryProviderMapping: Record<string, string> = {
  IN: 'greenhouse', // India uses Greenhouse
  US: 'greenhouse',
  CA: 'greenhouse',
  GB: 'lever',     // UK uses Lever
  PL: 'lever',
  DE: 'lever',      // Germany uses Lever
  AU: 'greenhouse',
  VN: 'greenhouse',
  PH: 'greenhouse',
  UA: 'lever',
};

// Bi-directional status mapping for different providers.
const statusMappings = {
  greenhouse: {
    internalToExternal: {
      APPLIED: 'application_submitted',
      SCREENED: 'screen',
      TECHNICAL_ROUND: 'technical_interview',
      HR_ROUND: 'hr_interview',
      FINAL_ROUND: 'final_interview',
      OFFER: 'offer',
      HIRED: 'hired',
      REJECTED: 'rejected',
    } as Record<ApplicationStatus, string>,
    externalToInternal: {
      application_submitted: 'APPLIED',
      screen: 'SCREENED',
      technical_interview: 'TECHNICAL_ROUND',
      hr_interview: 'HR_ROUND',
      final_interview: 'FINAL_ROUND',
      offer: 'OFFER',
      hired: 'HIRED',
      rejected: 'REJECTED',
    } as Record<string, ApplicationStatus>,
  },
  lever: {
    internalToExternal: {
      APPLIED: 'new-applicant',
      SCREENED: 'screen',
      TECHNICAL_ROUND: 'technical-screen',
      HR_ROUND: 'hr-interview',
      FINAL_ROUND: 'on-site-interview',
      OFFER: 'offer',
      HIRED: 'hired',
      REJECTED: 'archived-rejected',
    } as Record<ApplicationStatus, string>,
    externalToInternal: {
      'new-applicant': 'APPLIED',
      screen: 'SCREENED',
      'technical-screen': 'TECHNICAL_ROUND',
      'hr-interview': 'HR_ROUND',
      'on-site-interview': 'FINAL_ROUND',
      offer: 'OFFER',
      hired: 'HIRED',
      'archived-rejected': 'REJECTED',
    } as Record<string, ApplicationStatus>,
  },
};

export const atsConfig = {
  providerConfigs,
  countryProviderMapping,
  defaultProvider: 'greenhouse', // Fallback provider
  statusMappings,
};
