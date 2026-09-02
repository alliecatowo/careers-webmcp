import { Job, EmploymentType } from '@/lib/talent-acquisition';

// This is the new single source of truth for mock job data.
// In a real application, this layer would be replaced by a database client.

export const jobs: Job[] = [
  {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description:
      'Seeking a talented Senior Frontend Engineer to join our dynamic Engineering team in Bengaluru. You will be responsible for building and maintaining our core platform, working with a modern tech stack.',
    responsibilities: [
      'Develop and maintain user-facing features using React and TypeScript',
      'Collaborate with product and design teams to create high-quality user experiences',
      'Write clean, testable, and efficient code',
      'Mentor junior engineers and contribute to code reviews',
    ],
    qualifications: [
      '5+ years of relevant experience in frontend development',
      'Strong proficiency in React, TypeScript, and modern web technologies',
      'Experience with state management libraries like Redux or Zustand',
      'Excellent problem-solving skills and a passion for building great products',
    ],
    equityEligible: true,
    relocationSupport: true,
    visaSponsorship: false,
    salaryVisibility: 'Public' as const,
  },
  {
    id: 'job-2',
    requisitionCode: 'BAAL-US-MKTG-001',
    title: 'Head of Product Marketing',
    countryId: 'country_us',
    city: 'Remote',
    departmentId: 'dept_mktg',
    employmentType: 'Full-time',
    experienceBand: 'Lead',
    workforceType: 'Remote',
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'We are looking for a strategic Head of Product Marketing to lead our GTM strategy in North America. This is a key leadership role with high visibility.',
    responsibilities: [
      'Define and execute go-to-market strategies for new product launches',
      'Develop compelling product positioning and messaging',
      'Lead a team of product marketers',
    ],
    qualifications: [
      '10+ years of experience in product marketing, preferably in B2B SaaS',
      'Proven track record of successful product launches',
      'Strong leadership and communication skills',
    ],
    equityEligible: true,
    relocationSupport: false,
    visaSponsorship: false,
    salaryVisibility: 'RangeOnly' as const,
  },
  {
    id: 'job-3',
    requisitionCode: 'BAAL-PL-ENG-002',
    title: 'Go Backend Engineer',
    countryId: 'country_pl',
    city: 'Warsaw',
    departmentId: 'dept_eng_it',
    employmentType: 'Full-time',
    experienceBand: 'Mid',
    workforceType: 'Hybrid',
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'Join our growing backend team in Warsaw. You will work with Go to build and maintain the microservices that power our platform.',
    responsibilities: [
      'Design, develop, and deploy scalable backend services in Go',
      'Work with PostgreSQL and Kafka',
      'Ensure high performance and reliability of our APIs',
    ],
    qualifications: [
      '3+ years of experience with Go (Golang)',
      'Experience with microservices architecture',
      'Familiarity with cloud platforms like AWS or GCP',
    ],
    equityEligible: true,
    relocationSupport: false,
    visaSponsorship: true,
    salaryVisibility: 'Hidden' as const,
  },
  {
    id: 'job-4',
    requisitionCode: 'BAAL-IN-INT-001',
    title: 'Software Engineering Intern',
    countryId: 'country_in',
    city: 'Pune',
    state: 'Maharashtra',
    departmentId: 'dept_rd',
    employmentType: 'Internship',
    experienceBand: 'Intern',
    workforceType: 'Onsite',
    status: 'published',
    visibility: 'public',
    isNew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description:
      'Join our performance-based internship program in Pune. This is an opportunity to work on real-world projects and secure a full-time role at Baalvion.',
    responsibilities: [
      'Contribute to the development of our core product',
      'Learn from experienced engineers in a fast-paced environment',
      'Participate in all phases of the software development lifecycle',
    ],
    qualifications: [
      'Currently pursuing a degree in Computer Science or a related field',
      'Strong programming fundamentals in any language',
      'A passion for technology and a desire to learn',
    ],
    equityEligible: false,
    relocationSupport: false,
    visaSponsorship: false,
    salaryVisibility: 'Public' as const,
  },
  {
    id: 'job-5',
    requisitionCode: 'BAAL-GB-SUP-001',
    title: 'Customer Success Manager (EMEA)',
    countryId: 'country_gb',
    city: 'Remote',
    departmentId: 'dept_support',
    employmentType: 'Part-time',
    experienceBand: 'Mid',
    workforceType: 'Remote',
    status: 'published',
    visibility: 'public',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description:
      'We are seeking a Customer Success Manager to support our enterprise clients across the EMEA region. This role is crucial for driving customer adoption and satisfaction.',
    responsibilities: [
      'Serve as the primary point of contact for enterprise customers',
      'Develop and maintain strong relationships with key stakeholders',
      'Provide training and support to ensure customers are successful with our platform',
    ],
    qualifications: [
      '3+ years of experience in Customer Success or Account Management, preferably in SaaS',
      'Excellent communication and interpersonal skills',
      'Ability to work independently in a remote environment',
    ],
    equityEligible: false,
    relocationSupport: false,
    visaSponsorship: false,
    salaryVisibility: 'RangeOnly' as const,
  },
];

export function getAllJobs(
  filters: {
    status?: 'published' | 'draft';
    visibility?: 'public';
    countryId?: string;
    employmentType?: EmploymentType;
  } = {},
): Job[] {
  let filteredJobs = jobs;
  if (filters.status) {
    filteredJobs = filteredJobs.filter((j) => j.status === filters.status);
  }
  if (filters.visibility) {
    filteredJobs = filteredJobs.filter(
      (j) => j.visibility === filters.visibility,
    );
  }
  if (filters.countryId) {
    filteredJobs = filteredJobs.filter(
      (j) => j.countryId === filters.countryId,
    );
  }
  if (filters.employmentType) {
    filteredJobs = filteredJobs.filter(
      (j) => j.employmentType === filters.employmentType,
    );
  }
  return filteredJobs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getJobById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}
