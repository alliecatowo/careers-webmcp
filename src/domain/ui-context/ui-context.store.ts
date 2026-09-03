'use client';
/**
 * Live "where is the user right now" state, published by the normal UI via
 * the bridge components in ./bridges.tsx and read by careers_get_context.
 *
 * This is framework/router state, not DOM scraping. Pages that know their
 * subject (job detail, application form) declare it explicitly.
 */
import { create } from 'zustand';

export type PageKind =
  | 'jobs_index'
  | 'job_detail'
  | 'application'
  | 'my_applications'
  | 'saved_jobs'
  | 'profile'
  | 'sign_up'
  | 'export'
  | 'careers_info'
  | 'other';

export interface SearchViewState {
  query: string | null;
  departmentId: string | null;
  countryId: string | null;
  employmentType: string | null;
}

interface UiContextState {
  pathname: string;
  searchParams: Record<string, string>;
  /** Set by the job detail page while mounted. */
  currentJobId: string | null;
  /** Set by the application page while mounted. */
  currentApplicationId: string | null;
  setRoute: (pathname: string, searchParams: Record<string, string>) => void;
  setCurrentJob: (jobId: string | null) => void;
  setCurrentApplication: (applicationId: string | null) => void;
}

export const useUiContextStore = create<UiContextState>((set) => ({
  pathname: '/',
  searchParams: {},
  currentJobId: null,
  currentApplicationId: null,
  setRoute: (pathname, searchParams) => set({ pathname, searchParams }),
  setCurrentJob: (currentJobId) => set({ currentJobId }),
  setCurrentApplication: (currentApplicationId) => set({ currentApplicationId }),
}));

export function classifyPathname(pathname: string): PageKind {
  if (/^\/careers\/countries\/[^/]+\/jobs\/[^/]+/.test(pathname)) return 'job_detail';
  if (/^\/job\/[^/]+/.test(pathname)) return 'job_detail';
  if (/^\/careers\/application\//.test(pathname)) return 'application';
  if (pathname === '/careers' || pathname.startsWith('/careers/open-positions') || /^\/careers\/countries\/[^/]+\/?$/.test(pathname)) return 'jobs_index';
  if (/^\/careers\/exports\//.test(pathname)) return 'export';
  if (pathname.startsWith('/careers/signup')) return 'sign_up';
  if (pathname.startsWith('/my-account/applications')) return 'my_applications';
  if (pathname.startsWith('/my-account')) return 'profile';
  if (pathname.startsWith('/careers/')) return 'careers_info';
  return 'other';
}

export function getSearchViewState(): SearchViewState {
  const { searchParams, pathname } = useUiContextStore.getState();
  const onIndex = classifyPathname(pathname) === 'jobs_index';
  return {
    query: onIndex ? searchParams.q ?? null : null,
    departmentId: onIndex ? searchParams.departmentId ?? null : null,
    countryId: onIndex ? searchParams.countryId ?? null : null,
    employmentType: onIndex ? searchParams.employmentType ?? null : null,
  };
}
