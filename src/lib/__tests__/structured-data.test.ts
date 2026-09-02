/**
 * Tests for structured data generation
 * Run with: npm test structured-data.test.ts
 */

import { generateJobPostingStructuredData } from '../structured-data';
import { Job } from '@/lib/talent-acquisition';

// Mock job data for testing
const mockJob: Job = {
  id: 'job-1',
  requisitionCode: 'BAAL-IN-ENG-001',
  title: 'Senior Frontend Engineer',
  countryId: 'country_in',
  city: 'Bengaluru',
  state: 'Karnataka',
  departmentId: 'dept_eng_it',
  employmentType: 'Full-time',
  experienceBand: 'Senior',
  workforceType: 'Hybrid',
  status: 'published',
  visibility: 'public',
  isNew: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishEndDate: '2024-02-01T00:00:00.000Z',
  description:
    'Seeking a talented Senior Frontend Engineer to join our dynamic Engineering team.',
  responsibilities: [
    'Develop and maintain user-facing features using React and TypeScript',
    'Collaborate with product and design teams',
  ],
  qualifications: [
    '5+ years of relevant experience in frontend development',
    'Strong proficiency in React, TypeScript, and modern web technologies',
  ],
  equityEligible: true,
  relocationSupport: true,
  visaSponsorship: false,
  salaryBand: '120000-150000',
  currency: 'USD',
  salaryVisibility: 'Public',
  applicants: 12,
  tenantId: 'org_acme',
};

describe('generateJobPostingStructuredData', () => {
  test('generates valid JSON-LD structure', () => {
    const result = generateJobPostingStructuredData(mockJob);

    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('JobPosting');
    expect(result.title).toBe(mockJob.title);
    expect(result.description).toBe(mockJob.description);
  });

  test('includes salary information when public', () => {
    const result = generateJobPostingStructuredData(mockJob);

    expect(result.baseSalary).toBeDefined();
    expect(result.baseSalary.currency).toBe('USD');
    expect(result.baseSalary.value.minValue).toBe(120000);
    expect(result.baseSalary.value.maxValue).toBe(150000);
  });

  test('excludes salary when not public', () => {
    const jobWithHiddenSalary = {
      ...mockJob,
      salaryVisibility: 'Hidden' as const,
    };
    const result = generateJobPostingStructuredData(jobWithHiddenSalary);

    expect(result.baseSalary).toBeUndefined();
  });

  test('maps employment type correctly', () => {
    const result = generateJobPostingStructuredData(mockJob);
    expect(result.employmentType).toBe('FULL_TIME');
  });

  test('includes job location', () => {
    const result = generateJobPostingStructuredData(mockJob);

    expect(result.jobLocation).toBeDefined();
    expect(result.jobLocation.address.addressLocality).toBe('Bengaluru');
    expect(result.jobLocation.address.addressRegion).toBe('Karnataka');
    expect(result.jobLocation.address.addressCountry).toBe('IN');
  });

  test('includes hiring organization', () => {
    const result = generateJobPostingStructuredData(mockJob);

    expect(result.hiringOrganization).toBeDefined();
    expect(result.hiringOrganization.name).toBe('Baalvion');
    expect(result.hiringOrganization.sameAs).toBe('https://www.baalvion.com');
  });

  test('includes benefits when available', () => {
    const result = generateJobPostingStructuredData(mockJob);

    expect(result.jobBenefits).toContain('Equity compensation');
    expect(result.jobBenefits).toContain('Relocation assistance');
    expect(result.jobBenefits).not.toContain('Visa sponsorship');
  });

  test('uses custom base URL', () => {
    const customBaseUrl = 'https://custom.example.com';
    const result = generateJobPostingStructuredData(mockJob, customBaseUrl);

    expect(result.url).toContain(customBaseUrl);
    expect(result.hiringOrganization.logo).toContain(customBaseUrl);
  });
});

// Manual test function (uncomment to run)
/*
function manualTest() {
  console.log('🧪 Testing structured data generation...\n');
  
  const result = generateJobPostingStructuredData(mockJob);
  
  console.log('Generated JSON-LD:');
  console.log(JSON.stringify(result, null, 2));
  
  console.log('\n✅ Manual test completed');
}

// Uncomment to run manual test
// manualTest();
*/
