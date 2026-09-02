/**
 * INTERFACE CONTRACT — owned by Sonnet C (candidate operations).
 *
 * Saved jobs are a tiny normal candidate feature (upstream has none).
 * Human "Save" button and WebMCP `careers_set_saved_job` MUST both call
 * `setJobSaved` on this store. Persisted in localStorage, scoped per candidate.
 *
 * Implementation lives in ./saved-jobs.store.ts and is re-exported here.
 */
export {
  useSavedJobsStore,
  listSavedJobIds,
  isJobSaved,
  setJobSaved,
  SAVED_JOBS_STORAGE_KEY,
} from './saved-jobs.store';

// Signatures (frozen):
//   listSavedJobIds(candidateId: string): string[]          // newest first
//   isJobSaved(candidateId: string, jobId: string): boolean
//   setJobSaved(candidateId: string, jobId: string, saved: boolean): boolean  // returns resulting state
//   useSavedJobsStore — zustand hook; state.savedByCandidate: Record<candidateId, { jobId: string; savedAt: string }[]>
