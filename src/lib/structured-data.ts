import { Job } from '@/lib/talent-acquisition';

/**
 * Generate JSON-LD structured data for job postings
 * Follows schema.org JobPosting specification
 */
export function generateJobPostingStructuredData(
  job: Job,
  baseUrl: string = 'https://www.jobs.baalvion.com',
) {
  // Map employment types to schema.org values
  const employmentTypeMap: Record<string, string> = {
    'Full-time': 'FULL_TIME',
    'Part-time': 'PART_TIME',
    Contract: 'CONTRACTOR',
    Internship: 'INTERN',
    Temporary: 'TEMPORARY',
  };

  // Map experience bands to schema.org values
  const experienceLevelMap: Record<string, string> = {
    Entry: 'EntryLevel',
    Mid: 'MidLevel',
    Senior: 'SeniorLevel',
    Lead: 'ExecutiveLevel',
    Intern: 'EntryLevel',
  };

  // Map work types to schema.org values
  const workTypeMap: Record<string, string[]> = {
    Remote: ['https://schema.org/RemoteWork'],
    Onsite: ['https://schema.org/OnsiteWork'],
    Hybrid: ['https://schema.org/RemoteWork', 'https://schema.org/OnsiteWork'],
  };

  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    identifier: {
      '@type': 'PropertyValue',
      name: 'Baalvion Job ID',
      value: job.id,
    },
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    validThrough: job.publishEndDate,
    employmentType: employmentTypeMap[job.employmentType] || job.employmentType,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Baalvion',
      sameAs: 'https://www.baalvion.com',
      logo: `${baseUrl}/logo.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressRegion: job.state || undefined,
        addressCountry: getCountryCode(job.countryId),
      },
    },
    url: `${baseUrl}/careers/countries/${getCountrySlug(job.countryId)}/jobs/${
      job.id
    }`,
    applicationContact: {
      '@type': 'ContactPoint',
      contactType: 'HR',
      email: 'careers@baalvion.com',
    },
  };

  // Add salary information if available and public
  if (job.salaryVisibility === 'Public' && job.salaryBand) {
    const [minSalary, maxSalary] = parseSalaryBand(job.salaryBand);
    if (minSalary && maxSalary) {
      structuredData['baseSalary'] = {
        '@type': 'MonetaryAmount',
        currency: job.currency || 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: minSalary,
          maxValue: maxSalary,
          unitText: 'YEAR',
        },
      };
    }
  }

  // Add experience level if available
  if (job.experienceBand && experienceLevelMap[job.experienceBand]) {
    structuredData['experienceRequirements'] = {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: getExperienceMonths(job.experienceBand),
    };
  }

  // Add work arrangement
  if (job.workforceType && workTypeMap[job.workforceType]) {
    structuredData['jobLocationType'] = workTypeMap[job.workforceType];
  }

  // Add responsibilities if available
  if (job.responsibilities && job.responsibilities.length > 0) {
    structuredData['responsibilities'] = job.responsibilities.join('; ');
  }

  // Add qualifications if available
  if (job.qualifications && job.qualifications.length > 0) {
    structuredData['qualifications'] = job.qualifications.join('; ');
  }

  // Add benefits
  const benefits = [];
  if (job.equityEligible) benefits.push('Equity compensation');
  if (job.relocationSupport) benefits.push('Relocation assistance');
  if (job.visaSponsorship) benefits.push('Visa sponsorship');

  if (benefits.length > 0) {
    structuredData['jobBenefits'] = benefits.join(', ');
  }

  return structuredData;
}

/**
 * Helper function to parse salary band string
 */
function parseSalaryBand(salaryBand: string): [number | null, number | null] {
  // Handle various formats: "120000-150000", "120k-150k", "15-25 LPA"
  const cleanBand = salaryBand.replace(/[k,\s]/gi, '').replace('LPA', '00000');
  const match = cleanBand.match(/(\d+)-(\d+)/);

  if (match) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);

    // Handle 'k' notation
    const multiplier = salaryBand.toLowerCase().includes('k') ? 1000 : 1;

    return [min * multiplier, max * multiplier];
  }

  return [null, null];
}

/**
 * Map country IDs to country codes
 */
function getCountryCode(countryId: string): string {
  const countryMap: Record<string, string> = {
    country_us: 'US',
    country_in: 'IN',
    country_gb: 'GB',
    country_ca: 'CA',
    country_au: 'AU',
    country_pl: 'PL',
  };

  return countryMap[countryId] || 'US';
}

/**
 * Map country IDs to URL slugs
 */
function getCountrySlug(countryId: string): string {
  const slugMap: Record<string, string> = {
    country_us: 'united-states',
    country_in: 'india',
    country_gb: 'united-kingdom',
    country_ca: 'canada',
    country_au: 'australia',
    country_pl: 'poland',
  };

  return slugMap[countryId] || 'united-states';
}

/**
 * Map experience bands to approximate months
 */
function getExperienceMonths(experienceBand: string): number {
  const experienceMap: Record<string, number> = {
    Entry: 0,
    Mid: 36, // 3 years
    Senior: 60, // 5 years
    Lead: 120, // 10 years
    Intern: 0,
  };

  return experienceMap[experienceBand] || 0;
}

/**
 * Generate structured data script tag for embedding in HTML
 */
export function generateStructuredDataScript(
  job: Job,
  baseUrl?: string,
): string {
  const structuredData = generateJobPostingStructuredData(job, baseUrl);

  return `<script type="application/ld+json">
${JSON.stringify(structuredData, null, 2)}
</script>`;
}
