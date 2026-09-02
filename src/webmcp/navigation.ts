/**
 * Thin indirection so WebMCP tools can navigate the app through the real
 * Next.js router (installed by WebMCPProvider) instead of hard reloads.
 * Falls back to `window.location.assign` when no router has been installed
 * (e.g. in unit tests, or before the provider mounts).
 */
type Navigator = (path: string) => void;

let navigator_: Navigator | null = null;

export function setNavigator(fn: Navigator | null): void {
  navigator_ = fn;
}

export function navigate(path: string): void {
  if (navigator_) {
    navigator_(path);
    return;
  }
  if (typeof window !== 'undefined' && window.location) {
    window.location.assign(path);
  }
}

export function scrollToTop(): void {
  if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
