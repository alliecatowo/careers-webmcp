'use client';
/**
 * Canonical saved-jobs state, shared by the human "Save job" button and the
 * WebMCP `careers_set_saved_job` tool. Persisted in localStorage, scoped per
 * candidate. See ./index.ts for the frozen public signatures.
 */
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export const SAVED_JOBS_STORAGE_KEY = 'careers.savedJobs.v1';

export interface SavedJobEntry {
  jobId: string;
  savedAt: string;
}

interface SavedJobsState {
  savedByCandidate: Record<string, SavedJobEntry[]>;
  setJobSaved: (candidateId: string, jobId: string, saved: boolean) => boolean;
}

/** In-memory fallback so this store is importable under vitest's `node` environment. */
function createMemoryStorage(): StateStorage {
  const memory = new Map<string, string>();
  return {
    getItem: (name) => memory.get(name) ?? null,
    setItem: (name, value) => {
      memory.set(name, value);
    },
    removeItem: (name) => {
      memory.delete(name);
    },
  };
}

const storageImpl: StateStorage =
  typeof localStorage === 'undefined' ? createMemoryStorage() : (localStorage as unknown as StateStorage);

export const useSavedJobsStore = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      savedByCandidate: {},
      setJobSaved: (candidateId, jobId, saved) => {
        const current = get().savedByCandidate[candidateId] ?? [];
        const alreadySaved = current.some((entry) => entry.jobId === jobId);

        if (saved === alreadySaved) {
          // Idempotent: no state change needed.
          return saved;
        }

        const nextEntries = saved
          ? [{ jobId, savedAt: new Date().toISOString() }, ...current]
          : current.filter((entry) => entry.jobId !== jobId);

        set({
          savedByCandidate: {
            ...get().savedByCandidate,
            [candidateId]: nextEntries,
          },
        });
        return saved;
      },
    }),
    {
      name: SAVED_JOBS_STORAGE_KEY,
      storage: createJSONStorage(() => storageImpl),
    },
  ),
);

/** Newest first. */
export function listSavedJobIds(candidateId: string): string[] {
  const entries = useSavedJobsStore.getState().savedByCandidate[candidateId] ?? [];
  return [...entries].sort((a, b) => b.savedAt.localeCompare(a.savedAt)).map((entry) => entry.jobId);
}

export function isJobSaved(candidateId: string, jobId: string): boolean {
  const entries = useSavedJobsStore.getState().savedByCandidate[candidateId] ?? [];
  return entries.some((entry) => entry.jobId === jobId);
}

/** Returns the resulting saved state (true if now saved, false if now unsaved). */
export function setJobSaved(candidateId: string, jobId: string, saved: boolean): boolean {
  return useSavedJobsStore.getState().setJobSaved(candidateId, jobId, saved);
}
