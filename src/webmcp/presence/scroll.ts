'use client';
/**
 * Bring whatever the agent just touched into view.
 *
 * An agent action that happens off-screen reads as nothing happening at all,
 * which is the one failure mode this whole presence layer exists to prevent.
 * Every highlight, focus, typed query and hand-off cue routes through here.
 *
 * Two rules keep it from being obnoxious:
 *   - it does nothing when the element is already comfortably on screen, so a
 *     human reading the field the agent is filling is never yanked around;
 *   - it honours `prefers-reduced-motion` by jumping instead of animating.
 */

/** Fraction of the viewport treated as "comfortably visible" at each edge. */
const COMFORT_MARGIN = 0.15;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** True when the element sits inside the comfortable band of the viewport. */
export function isComfortablyInView(element: Element): boolean {
  if (typeof window === 'undefined') return true;
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  const height = window.innerHeight || 0;
  const margin = height * COMFORT_MARGIN;
  return rect.top >= margin && rect.bottom <= height - margin;
}

/**
 * Scroll `element` to the middle of the viewport unless it is already there.
 * Safe to call with null, during SSR, or in a JSDOM test.
 */
export function scrollAgentTargetIntoView(element: Element | null | undefined): void {
  if (!element || typeof window === 'undefined') return;
  if (typeof (element as HTMLElement).scrollIntoView !== 'function') return;
  if (isComfortablyInView(element)) return;
  try {
    element.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'center',
    });
  } catch {
    // Older engines reject the options object; a plain scroll is fine.
    try {
      (element as HTMLElement).scrollIntoView();
    } catch {
      /* never let a scroll break a tool call */
    }
  }
}

/**
 * Find `[data-testid="…"]` and scroll to it, retrying while the target page
 * mounts. Agent navigation and the cue usually fire in the same tick, so the
 * element often does not exist yet on the first attempt.
 *
 * Returns a cancel function.
 */
export function scrollToTestIdWhenReady(testId: string, maxAttempts = 20, intervalMs = 100): () => void {
  if (typeof window === 'undefined') return () => {};
  let attempts = 0;
  let timer = 0;
  const attempt = () => {
    const element = document.querySelector(`[data-testid="${testId}"]`);
    if (element) {
      scrollAgentTargetIntoView(element);
      return;
    }
    if (++attempts < maxAttempts) timer = window.setTimeout(attempt, intervalMs);
  };
  attempt();
  return () => window.clearTimeout(timer);
}
