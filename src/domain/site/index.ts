/**
 * The careers site's own map and its authored informational content.
 *
 * One source, two consumers — exactly like `filterAndRankJobs`. The normal
 * pages render this content and `careers_open_page` / `careers_get_site_info`
 * expose it, so the agent can never describe a page the human doesn't see.
 *
 * Every destination here corresponds to a place a human can already reach by
 * clicking. Nothing new is exposed to an agent that isn't already in the UI.
 */

/** Stable ids the agent addresses. Renaming one is a breaking tool change. */
export type SiteDestinationId =
  | 'careers_home'
  | 'jobs'
  | 'full_time_roles'
  | 'part_time_roles'
  | 'hiring_process'
  | 'internship_program'
  | 'life_at_company'
  | 'sign_up'
  | 'my_applications'
  | 'saved_jobs'
  | 'profile'
  | 'export';

export interface SiteDestination {
  id: SiteDestinationId;
  /** Authored label. Never interpolated from job or application content. */
  label: string;
  /** What the person will see there, for the agent to choose sensibly. */
  description: string;
  /** Path, or null when it must be built from a parameter (see `export`). */
  path: string | null;
  /** Whether a signed-in candidate is required to see anything useful. */
  requiresAuth: boolean;
}

export const SITE_DESTINATIONS: SiteDestination[] = [
  {
    id: 'careers_home',
    label: 'Careers home',
    description: 'The careers landing page: who the employer is and where to start.',
    path: '/careers',
    requiresAuth: false,
  },
  {
    id: 'jobs',
    label: 'All open positions',
    description: 'The full job board with the visible search box and filters.',
    path: '/careers/open-positions',
    requiresAuth: false,
  },
  {
    id: 'full_time_roles',
    label: 'Full-time roles',
    description: 'Open positions filtered to full-time employment.',
    path: '/careers/full-time',
    requiresAuth: false,
  },
  {
    id: 'part_time_roles',
    label: 'Part-time roles',
    description: 'Open positions filtered to part-time employment.',
    path: '/careers/part-time',
    requiresAuth: false,
  },
  {
    id: 'hiring_process',
    label: 'How hiring works here',
    description: 'The employer’s four-step hiring process, start to offer.',
    path: '/careers/hiring-process',
    requiresAuth: false,
  },
  {
    id: 'internship_program',
    label: 'Internship program',
    description: 'The performance-based internship program, tracks and competencies.',
    path: '/careers/internship-program',
    requiresAuth: false,
  },
  {
    id: 'life_at_company',
    label: 'Life at the company',
    description: 'Culture and values page.',
    path: '/careers/life-at-baalvion',
    requiresAuth: false,
  },
  {
    id: 'sign_up',
    label: 'Create an account',
    description:
      'The normal sign-up form. Use careers_create_account to fill it; only the person can press Create account.',
    path: '/careers/signup',
    requiresAuth: false,
  },
  {
    id: 'my_applications',
    label: 'My applications',
    description: 'The candidate’s own drafts and submitted applications.',
    path: '/my-account?tab=applications',
    requiresAuth: true,
  },
  {
    id: 'saved_jobs',
    label: 'My saved jobs',
    description: 'The roles the candidate has saved for later.',
    path: '/my-account?tab=saved-jobs',
    requiresAuth: true,
  },
  {
    id: 'profile',
    label: 'Profile and settings',
    description: 'The candidate’s own profile and account settings.',
    path: '/my-account?tab=settings',
    requiresAuth: true,
  },
  {
    id: 'export',
    label: 'A prepared export',
    description:
      'The download page for an export. Requires the exportId returned by careers_create_export.',
    path: null,
    requiresAuth: false,
  },
];

export const SITE_DESTINATION_IDS: SiteDestinationId[] = SITE_DESTINATIONS.map((d) => d.id);

export function getDestination(id: SiteDestinationId): SiteDestination | null {
  return SITE_DESTINATIONS.find((d) => d.id === id) ?? null;
}

/** Resolve a destination to a real path. `export` needs an exportId. */
export function destinationPath(id: SiteDestinationId, exportId?: string): string | null {
  if (id === 'export') return exportId ? `/careers/exports/${encodeURIComponent(exportId)}` : null;
  return getDestination(id)?.path ?? null;
}

/* ------------------------------------------------------------------ *
 * Authored informational content, rendered by the normal pages.
 * ------------------------------------------------------------------ */

export interface HiringProcessStep {
  number: string;
  name: string;
  description: string;
}

/** Rendered by /careers/hiring-process. */
export const HIRING_PROCESS_STEPS: HiringProcessStep[] = [
  {
    number: '01',
    name: 'Apply',
    description:
      'Submit your application for an open role that matches your skills and interests via our careers portal.',
  },
  {
    number: '02',
    name: 'Interview',
    description:
      'Meet with our talent acquisition team and hiring managers to discuss your experience, skills, and cultural alignment.',
  },
  {
    number: '03',
    name: 'Assessment',
    description:
      'Participate in a role-specific, skills-based assessment. This could be a technical challenge, a case study, or a portfolio review.',
  },
  {
    number: '04',
    name: 'Offer',
    description:
      'Successful candidates receive a competitive, comprehensive offer to join our global team.',
  },
];

/** Rendered by /careers/internship-program. */
export const INTERNSHIP_SPECIALIZATIONS: string[] = [
  'Full-Stack Engineering (React, Go)',
  'Cloud & DevOps Engineering (AWS, Kubernetes)',
  'Data Science & Machine Learning',
  'Product Management',
  'UX/UI Design',
  'Talent Acquisition & HR Tech',
];

/** Rendered by /careers/internship-program. */
export const INTERNSHIP_COMPETENCIES: string[] = [
  'Technical Proficiency',
  'Problem-Solving & Critical Thinking',
  'Ownership & Accountability',
  'Communication & Collaboration',
  'Adaptability & Learning Agility',
];

export const INTERNSHIP_SUMMARY =
  'A merit-driven, performance-focused internship at the India headquarters. Compensation, responsibilities and the pathway to a full-time role are tied to demonstrated competency and impact.';

export type SiteInfoTopic = 'hiring_process' | 'internship_program' | 'destinations';

export const SITE_INFO_TOPICS: SiteInfoTopic[] = [
  'hiring_process',
  'internship_program',
  'destinations',
];
