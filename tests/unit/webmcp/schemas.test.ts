import { describe, it, expect, vi } from 'vitest';
import { applicationsModule } from './fixtures';

vi.mock('@/domain/applications', () => applicationsModule);

import { validateInput } from '@/webmcp/schemas';
import { WebMCPError } from '@/webmcp/errors';

describe('schema validation', () => {
  it('accepts maxResults within bounds', () => {
    expect(() => validateInput('careers_search_jobs', { maxResults: 30 })).not.toThrow();
    expect(() => validateInput('careers_search_jobs', { maxResults: 1 })).not.toThrow();
  });

  it('rejects maxResults over the max with SEARCH_LIMIT_EXCEEDED', () => {
    try {
      validateInput('careers_search_jobs', { maxResults: 31 });
      throw new Error('expected validateInput to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(WebMCPError);
      expect((err as WebMCPError).code).toBe('SEARCH_LIMIT_EXCEEDED');
    }
  });

  it('rejects maxResults below 1 with VALIDATION_ERROR', () => {
    try {
      validateInput('careers_search_jobs', { maxResults: 0 });
      throw new Error('expected validateInput to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(WebMCPError);
      expect((err as WebMCPError).code).toBe('VALIDATION_ERROR');
    }
  });

  it('rejects unknown keys in careers_update_application.fields with VALIDATION_ERROR', () => {
    try {
      validateInput('careers_update_application', {
        applicationId: 'app_1',
        expectedRevision: 1,
        fields: { ssn: '123-45-6789' },
      });
      throw new Error('expected validateInput to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(WebMCPError);
      expect((err as WebMCPError).code).toBe('VALIDATION_ERROR');
    }
  });

  it('accepts known application fields in careers_update_application', () => {
    expect(() =>
      validateInput('careers_update_application', {
        applicationId: 'app_1',
        expectedRevision: 1,
        fields: { phone: '+1 555 0100', coverNote: 'hello' },
      }),
    ).not.toThrow();
  });

  it('requires jobId for careers_open_job and careers_start_application', () => {
    expect(() => validateInput('careers_open_job', {})).toThrow(WebMCPError);
    expect(() => validateInput('careers_start_application', {})).toThrow(WebMCPError);
  });

  it('requires jobId and saved for careers_set_saved_job', () => {
    expect(() => validateInput('careers_set_saved_job', { jobId: 'job_1' })).toThrow(WebMCPError);
    expect(() => validateInput('careers_set_saved_job', { jobId: 'job_1', saved: true })).not.toThrow();
  });

  it('ignores unknown top-level keys rather than throwing (schema strictness is enforced by the browser API, not this validator)', () => {
    expect(() => validateInput('careers_get_context', { somethingWeird: 1 })).not.toThrow();
  });
});
