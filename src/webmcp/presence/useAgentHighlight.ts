'use client';
/**
 * Subscribe a control to agent highlights.
 *
 * Returns true for a short window after the agent touched `key`, so the
 * component can play its own flash/ring animation. `key` is a form field id
 * (e.g. "portfolioUrl") or a logical key (e.g. "job-title").
 */
import { useEffect, useState } from 'react';
import { usePresenceStore, clearHighlight } from './presence.store';

const FLASH_MS = 1400;

export function useAgentHighlight(key: string): boolean {
  const entry = usePresenceStore((s) => s.highlights.find((h) => h.key === key));
  const at = entry?.at ?? null;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (at === null) {
      setActive(false);
      return;
    }
    setActive(true);
    const timer = window.setTimeout(() => {
      setActive(false);
      clearHighlight(key);
    }, FLASH_MS);
    return () => window.clearTimeout(timer);
  }, [at, key]);

  return active;
}

/** Tailwind classes for the standard agent-touched flash. */
export const AGENT_FLASH_CLASS =
  'ring-2 ring-sky-400/70 ring-offset-2 ring-offset-background bg-sky-400/5 transition-[box-shadow,background-color] duration-300';
