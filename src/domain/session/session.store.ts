'use client';
/**
 * Canonical candidate session for the careers site.
 *
 * This is the ONE session abstraction used by the human UI (header sign-in,
 * protected candidate pages) and by the WebMCP adapter. It intentionally holds
 * no secrets: no tokens, no passwords, no cookies. In demo mode the session is
 * persisted in localStorage under a single key.
 *
 * WebMCP must read `useSessionStore.getState()` (or the helpers below) and must
 * never dump localStorage directly.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  yearsExperience: number | null;
}

export interface CandidateSession {
  /** Stable candidate id. Used to scope saved jobs and applications. */
  id: string;
  displayName: string;
  email: string;
  /** Profile values the normal application form prefills from. */
  profile: CandidateProfile;
}

export const DEMO_CANDIDATE: CandidateSession = {
  id: 'candidate-demo',
  displayName: 'Avery Chen',
  email: 'avery.chen@example.test',
  profile: {
    fullName: 'Avery Chen',
    email: 'avery.chen@example.test',
    phone: '',
    location: 'Oakland, CA',
    linkedinUrl: 'https://www.linkedin.com/in/avery-chen-demo',
    portfolioUrl: '',
    yearsExperience: 7,
  },
};

export const SESSION_STORAGE_KEY = 'careers.session.v1';

/** Profile values a new candidate supplies at signup. */
export interface SignUpProfile extends CandidateProfile {}

interface SessionState {
  /** `hydrating` until the persisted session has been read on the client. */
  status: 'hydrating' | 'ready';
  candidate: CandidateSession | null;
  signInAsDemoCandidate: () => CandidateSession;
  /**
   * Create a real (non-demo) candidate session. Only ever called from the
   * human-clicked Create account button — see domain/session/signup.store.ts.
   */
  signUp: (profile: SignUpProfile) => CandidateSession;
  signOut: () => void;
  /** internal */
  _setHydrated: () => void;
}

/**
 * Stable per-browser candidate id. Derived from the email so a candidate who
 * signs up twice with the same address keeps their saved jobs and drafts,
 * rather than orphaning them under a fresh id.
 */
export function candidateIdForEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) | 0;
  }
  return `candidate-${(hash >>> 0).toString(36)}`;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      status: 'hydrating',
      candidate: null,
      signInAsDemoCandidate: () => {
        set({ candidate: DEMO_CANDIDATE, status: 'ready' });
        return DEMO_CANDIDATE;
      },
      signUp: (profile) => {
        const email = profile.email.trim();
        const candidate: CandidateSession = {
          id: candidateIdForEmail(email),
          displayName: profile.fullName.trim() || email,
          email,
          profile: { ...profile, email },
        };
        set({ candidate, status: 'ready' });
        return candidate;
      },
      signOut: () => set({ candidate: null, status: 'ready' }),
      _setHydrated: () => set({ status: 'ready' }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ candidate: s.candidate }),
      onRehydrateStorage: () => (state) => state?._setHydrated(),
    },
  ),
);

/** Non-React accessor for services / WebMCP. Returns null when signed out. */
export function getCurrentCandidate(): CandidateSession | null {
  return useSessionStore.getState().candidate;
}

/** Public, secret-free view of the session suitable for tool results. */
export function getSessionSummary(): {
  signedIn: boolean;
  candidate: { id: string; displayName: string } | null;
} {
  const c = getCurrentCandidate();
  return c ? { signedIn: true, candidate: { id: c.id, displayName: c.displayName } } : { signedIn: false, candidate: null };
}
