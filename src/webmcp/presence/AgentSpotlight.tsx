'use client';
/**
 * Wraps a piece of the normal page so it flashes when the agent navigated the
 * human here. Renders its children unchanged when no agent is involved.
 */
import type { ReactNode } from 'react';
import { useAgentHighlight } from './useAgentHighlight';

export function AgentSpotlight({ highlightKey, children }: { highlightKey: string; children: ReactNode }) {
  const active = useAgentHighlight(highlightKey);
  return (
    <span
      className={
        'block rounded-lg transition-[box-shadow,background-color] duration-500' +
        (active ? ' bg-sky-400/10 shadow-[0_0_0_6px_rgba(56,189,248,0.12)]' : '')
      }
      data-agent-spotlight={active || undefined}
    >
      {children}
    </span>
  );
}
