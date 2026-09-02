import { beforeEach, describe, expect, it } from 'vitest';
import {
  isJobSaved,
  listSavedJobIds,
  setJobSaved,
  useSavedJobsStore,
} from '@/domain/saved-jobs';

describe('saved-jobs store', () => {
  beforeEach(() => {
    useSavedJobsStore.setState({ savedByCandidate: {} });
  });

  it('saves and unsaves a job', () => {
    expect(isJobSaved('cand-1', 'job-1')).toBe(false);

    const savedResult = setJobSaved('cand-1', 'job-1', true);
    expect(savedResult).toBe(true);
    expect(isJobSaved('cand-1', 'job-1')).toBe(true);

    const unsavedResult = setJobSaved('cand-1', 'job-1', false);
    expect(unsavedResult).toBe(false);
    expect(isJobSaved('cand-1', 'job-1')).toBe(false);
  });

  it('is idempotent', () => {
    setJobSaved('cand-1', 'job-1', true);
    setJobSaved('cand-1', 'job-1', true);
    setJobSaved('cand-1', 'job-1', true);

    expect(useSavedJobsStore.getState().savedByCandidate['cand-1']).toHaveLength(1);
  });

  it('isolates saved jobs per candidate', () => {
    setJobSaved('cand-1', 'job-1', true);
    setJobSaved('cand-2', 'job-2', true);

    expect(listSavedJobIds('cand-1')).toEqual(['job-1']);
    expect(listSavedJobIds('cand-2')).toEqual(['job-2']);
    expect(isJobSaved('cand-1', 'job-2')).toBe(false);
  });

  it('lists saved jobs newest first', async () => {
    setJobSaved('cand-1', 'job-1', true);
    await new Promise((resolve) => setTimeout(resolve, 2));
    setJobSaved('cand-1', 'job-2', true);
    await new Promise((resolve) => setTimeout(resolve, 2));
    setJobSaved('cand-1', 'job-3', true);

    expect(listSavedJobIds('cand-1')).toEqual(['job-3', 'job-2', 'job-1']);
  });
});
