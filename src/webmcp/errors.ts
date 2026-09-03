/**
 * Structured error model for WebMCP tool results.
 *
 * Every tool `execute` catches thrown errors and converts them via
 * `toErrorResult` before wrapping in `fail()` (see results.ts). Never leak
 * stack traces or internal messages to the model.
 */
import { ApplicationError } from '@/domain/applications';
import { SignUpError } from '@/domain/session/signup.store';

export const WEBMCP_ERROR_CODES = [
  'WEBMCP_UNAVAILABLE',
  'AUTH_REQUIRED',
  'JOB_NOT_FOUND',
  'APPLICATION_NOT_FOUND',
  'APPLICATION_ALREADY_SUBMITTED',
  'STALE_APPLICATION',
  'VALIDATION_ERROR',
  'SEARCH_LIMIT_EXCEEDED',
  'EXPORT_NOT_FOUND',
  'UNSUPPORTED_ACTION',
  'INTERNAL_ERROR',
] as const;

export type WebMCPErrorCode = (typeof WEBMCP_ERROR_CODES)[number];

export class WebMCPError extends Error {
  constructor(
    public readonly code: WebMCPErrorCode,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'WebMCPError';
  }
}

export interface ErrorResult {
  error: WebMCPErrorCode | string;
  message: string;
  [key: string]: unknown;
}

/**
 * Convert any thrown value into a bounded, structured error body.
 * Never includes a stack trace. Unknown errors collapse to INTERNAL_ERROR
 * with a generic message (no internal detail leakage).
 */
export function toErrorResult(err: unknown): ErrorResult {
  if (err instanceof WebMCPError) {
    return { error: err.code, message: err.message, ...err.details };
  }
  if (err instanceof ApplicationError) {
    return { error: err.code, message: err.message, ...err.details };
  }
  if (err instanceof SignUpError) {
    return { error: err.code, message: err.message, ...err.details };
  }
  return {
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong handling this request.',
  };
}
