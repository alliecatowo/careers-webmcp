import { describe, it, expect } from 'vitest';
import { ok, fail, boundText, boundResult, LIMITS } from '@/webmcp/results';

describe('ok/fail envelope shape', () => {
  it('ok() wraps data as MCP CallToolResult text + structuredContent', () => {
    const result = ok({ hello: 'world' });
    expect(result.content).toEqual([{ type: 'text', text: JSON.stringify({ hello: 'world' }) }]);
    expect(result.structuredContent).toEqual({ hello: 'world' });
    expect(result.isError).toBeUndefined();
  });

  it('fail() sets isError: true and mirrors the error body', () => {
    const errObj = { error: 'JOB_NOT_FOUND', message: 'nope' };
    const result = fail(errObj);
    expect(result.isError).toBe(true);
    expect(result.structuredContent).toEqual(errObj);
    expect(JSON.parse(result.content[0].text)).toEqual(errObj);
  });
});

describe('boundText', () => {
  it('leaves short strings untouched', () => {
    const { text, truncated } = boundText('hello', 100);
    expect(text).toBe('hello');
    expect(truncated).toBe(false);
  });

  it('truncates strings exceeding the byte limit and reports truncated:true', () => {
    const long = 'x'.repeat(1000);
    const { text, truncated } = boundText(long, 50);
    expect(truncated).toBe(true);
    expect(text.length).toBeLessThanOrEqual(50);
  });
});

describe('boundResult', () => {
  it('passes small objects through unchanged (no truncated flag)', () => {
    const data = { id: 'job_1', title: 'Staff Engineer' };
    const result = boundResult(data);
    expect(result).toMatchObject(data);
    expect((result as { truncated?: boolean }).truncated).toBeUndefined();
  });

  it('truncates long prose fields and sets truncated:true', () => {
    const data = { summary: 'y'.repeat(LIMITS.proseBytes + 5000) };
    const result = boundResult(data) as { summary: string; truncated?: boolean };
    expect(result.truncated).toBe(true);
    expect(new TextEncoder().encode(result.summary).length).toBeLessThanOrEqual(LIMITS.proseBytes);
  });

  it('caps oversized arrays', () => {
    const data = { jobs: Array.from({ length: 500 }, (_, i) => ({ id: `job_${i}` })) };
    const result = boundResult(data) as { jobs: unknown[]; truncated?: boolean };
    expect(result.jobs.length).toBeLessThanOrEqual(50);
    expect(result.truncated).toBe(true);
  });

  it('keeps the overall serialized result under 50KB', () => {
    const data = { description: 'z'.repeat(200_000) };
    const serialized = JSON.stringify(boundResult(data));
    expect(new TextEncoder().encode(serialized).length).toBeLessThanOrEqual(LIMITS.resultBytes);
  });
});
