/**
 * Revision helper for application draft optimistic concurrency.
 *
 * The domain layer (`updateApplication` / `submitApplication` in
 * '@/domain/applications') already enforces revision matching and throws
 * `ApplicationError('STALE_APPLICATION', ..., { expectedRevision, currentRevision })`
 * on mismatch. This module exists purely to document/translate that contract
 * for WebMCP callers — it does not duplicate the check.
 */
import { WebMCPError } from './errors';

/**
 * Optional defensive check usable before calling into the domain layer when
 * a caller already has both values in hand (e.g. tests). The domain store
 * remains the source of truth; this just fails fast with the same shape.
 */
export function assertRevision(expected: number | null, current: number): void {
  if (expected === null) return; // human writes always win; no check
  if (expected !== current) {
    throw new WebMCPError('STALE_APPLICATION', 'The application has changed since you last read it.', {
      expectedRevision: expected,
      currentRevision: current,
    });
  }
}
