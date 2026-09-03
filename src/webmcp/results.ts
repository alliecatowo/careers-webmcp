/**
 * Shared result envelope + output bounding for all WebMCP tools.
 *
 * `execute` callbacks must return the MCP CallToolResult shape:
 *   { content: [{ type: 'text', text: JSON.stringify(data) }], structuredContent?, isError? }
 */
import type { ErrorResult } from './errors';

export const LIMITS = {
  searchDefault: 10,
  searchMax: 30,
  proseBytes: 20_000,
  resultBytes: 50_000,
} as const;

export interface ToolCallResult {
  content: { type: 'text'; text: string }[];
  structuredContent?: unknown;
  isError?: boolean;
}

export function ok(data: unknown): ToolCallResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(data) }],
    structuredContent: data,
  };
}

export function fail(errObj: ErrorResult): ToolCallResult {
  return {
    content: [{ type: 'text', text: JSON.stringify(errObj) }],
    structuredContent: errObj,
    isError: true,
  };
}

function byteLength(s: string): number {
  // Node & browser both support TextEncoder; fall back to length as approximation.
  try {
    return new TextEncoder().encode(s).length;
  } catch {
    return s.length;
  }
}

/** Truncate a string to at most `max` bytes (approximated via UTF-16 length fallback). */
export function boundText(s: string, max: number): { text: string; truncated: boolean } {
  if (typeof s !== 'string') return { text: s, truncated: false };
  if (byteLength(s) <= max) return { text: s, truncated: false };
  // Binary-search-free simple approach: slice by char count, shrink until it fits.
  let end = Math.min(s.length, max);
  let sliced = s.slice(0, end);
  while (byteLength(sliced) > max && end > 0) {
    end -= 1;
    sliced = s.slice(0, end);
  }
  return { text: sliced, truncated: true };
}

const ARRAY_MAX_ITEMS = 50;

/**
 * Recursively bound a result payload: long prose strings get truncated to
 * LIMITS.proseBytes, oversized arrays get capped, and if the overall
 * serialized payload still exceeds LIMITS.resultBytes it is truncated at the
 * top level. Sets `truncated: true` on the returned object whenever any
 * bounding was applied.
 */
export function boundResult<T>(data: T): T & { truncated?: boolean } {
  let truncatedFlag = false;

  function walk(value: unknown): unknown {
    if (typeof value === 'string') {
      const { text, truncated } = boundText(value, LIMITS.proseBytes);
      if (truncated) truncatedFlag = true;
      return text;
    }
    if (Array.isArray(value)) {
      let arr = value;
      if (arr.length > ARRAY_MAX_ITEMS) {
        arr = arr.slice(0, ARRAY_MAX_ITEMS);
        truncatedFlag = true;
      }
      return arr.map((v) => walk(v));
    }
    if (value && typeof value === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out[k] = walk(v);
      }
      return out;
    }
    return value;
  }

  const walked = walk(data) as T;
  let serialized = JSON.stringify(walked);

  if (byteLength(serialized) > LIMITS.resultBytes) {
    truncatedFlag = true;
    // Hard cap: truncate the serialized JSON string bytes and re-wrap.
    const { text } = boundText(serialized, LIMITS.resultBytes - 200);
    return {
      truncated: true,
      note: 'Result truncated to stay within output bounds.',
      partial: text,
    } as unknown as T & { truncated?: boolean };
  }

  if (truncatedFlag && walked && typeof walked === 'object' && !Array.isArray(walked)) {
    return { ...(walked as object), truncated: true } as T & { truncated?: boolean };
  }

  return walked as T & { truncated?: boolean };
}
