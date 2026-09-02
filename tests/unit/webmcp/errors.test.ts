import { describe, it, expect, vi } from 'vitest';
import { applicationsModule } from './fixtures';

vi.mock('@/domain/applications', () => applicationsModule);

import { WebMCPError, toErrorResult, WEBMCP_ERROR_CODES } from '@/webmcp/errors';
import { ApplicationError } from '@/domain/applications';

describe('toErrorResult', () => {
  it.each(WEBMCP_ERROR_CODES)('maps WebMCPError code %s to { error, message }', (code) => {
    const err = new WebMCPError(code, `message for ${code}`, { extra: 1 });
    const result = toErrorResult(err);
    expect(result.error).toBe(code);
    expect(result.message).toBe(`message for ${code}`);
    expect(result.extra).toBe(1);
  });

  it('maps ApplicationError (domain layer) to the same { error, message, ...details } shape', () => {
    const err = new ApplicationError('STALE_APPLICATION', 'stale', { expectedRevision: 3, currentRevision: 4 });
    const result = toErrorResult(err);
    expect(result).toEqual({
      error: 'STALE_APPLICATION',
      message: 'stale',
      expectedRevision: 3,
      currentRevision: 4,
    });
  });

  it('collapses unknown thrown values to INTERNAL_ERROR without leaking detail', () => {
    const result = toErrorResult(new Error('some sensitive internal detail, stack trace, file path'));
    expect(result.error).toBe('INTERNAL_ERROR');
    expect(result.message).not.toMatch(/sensitive|stack|file path/i);
  });

  it('collapses non-Error thrown values to INTERNAL_ERROR', () => {
    const result = toErrorResult('a plain string throw');
    expect(result.error).toBe('INTERNAL_ERROR');
  });

  it('never includes a stack property', () => {
    const result = toErrorResult(new Error('boom'));
    expect(result).not.toHaveProperty('stack');
    expect(JSON.stringify(result)).not.toMatch(/at .*\.ts:\d+/);
  });
});
