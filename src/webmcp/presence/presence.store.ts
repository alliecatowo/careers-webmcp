'use client';
/**
 * Agent presence: a transient, read-only *echo* of what the agent just did on
 * this page.
 *
 * BUILD_CONTRACT #15 forbids the site summoning the agent, and #72 forbids an
 * "agent activity sidebar". This is neither. Nothing here can start an agent,
 * nothing is persistent, and the whole layer renders literally nothing until a
 * WebMCP tool has actually been invoked on this page load. It exists to satisfy
 * the contract's own requirement that "agent navigation visibly affects the
 * normal site" — see docs/DECISIONS.md.
 *
 * The store is written to ONLY by the tool instrumentation wrapper
 * (./instrument.ts). The normal human UI never writes to it.
 */
import { create } from 'zustand';

export type ActivityPhase = 'running' | 'done' | 'error';

export interface AgentActivity {
  id: number;
  tool: string;
  /** Human-readable present-tense label, e.g. "Searching jobs". Authored by us. */
  label: string;
  phase: ActivityPhase;
  /** Short result caption shown on completion, e.g. "6 matches". Authored by us. */
  detail: string | null;
  startedAt: number;
  endedAt: number | null;
}

/** A staged action the agent has prepared and handed back to the human. */
export interface PendingConfirmation {
  kind: 'create_account' | 'submit_application';
  /** Which page/control the human should look at. */
  targetTestId: string;
  label: string;
  at: number;
}

/** Characters the agent is "typing" into a visible input. */
export interface TypingState {
  target: 'job_search';
  full: string;
  typed: string;
  done: boolean;
}

export interface HighlightState {
  /** DOM id (form fields) or logical key (job title, export button). */
  key: string;
  kind: 'field' | 'job' | 'action';
  at: number;
}

interface PresenceState {
  /** Flips true the first time any tool runs. Gates every visual. */
  agentPresent: boolean;
  activities: AgentActivity[];
  typing: TypingState | null;
  highlights: HighlightState[];
  pendingConfirmation: PendingConfirmation | null;
  /** Export the agent most recently prepared, surfaced to the human as a download. */
  offeredExportId: string | null;
  /** Field the agent asked the page to focus. The form component does the focusing. */
  focusRequest: { key: string; at: number } | null;
}

const ACTIVITY_HISTORY = 6;

let nextActivityId = 1;

export const usePresenceStore = create<PresenceState>(() => ({
  agentPresent: false,
  activities: [],
  typing: null,
  highlights: [],
  pendingConfirmation: null,
  offeredExportId: null,
  focusRequest: null,
}));

export function beginActivity(tool: string, label: string): number {
  const id = nextActivityId++;
  const activity: AgentActivity = {
    id,
    tool,
    label,
    phase: 'running',
    detail: null,
    startedAt: Date.now(),
    endedAt: null,
  };
  usePresenceStore.setState((s) => ({
    agentPresent: true,
    activities: [...s.activities, activity].slice(-ACTIVITY_HISTORY),
  }));
  return id;
}

export function endActivity(id: number, phase: 'done' | 'error', detail: string | null): void {
  usePresenceStore.setState((s) => ({
    activities: s.activities.map((a) =>
      a.id === id ? { ...a, phase, detail, endedAt: Date.now() } : a,
    ),
  }));
}

export function dismissActivity(id: number): void {
  usePresenceStore.setState((s) => ({ activities: s.activities.filter((a) => a.id !== id) }));
}

/** Start an agent "typing" animation into a visible input. */
export function startTyping(target: TypingState['target'], full: string): void {
  usePresenceStore.setState({ agentPresent: true, typing: { target, full, typed: '', done: false } });
}

export function advanceTyping(typed: string, done: boolean): void {
  usePresenceStore.setState((s) => (s.typing ? { typing: { ...s.typing, typed, done } } : {}));
}

export function clearTyping(): void {
  usePresenceStore.setState({ typing: null });
}

/**
 * Flash one or more controls. `keys` are form-field ids or logical keys; the
 * matching component subscribes and plays its own animation.
 */
export function highlight(kind: HighlightState['kind'], keys: string[]): void {
  const at = Date.now();
  usePresenceStore.setState((s) => ({
    agentPresent: true,
    // Replace any prior highlight for the same key so a re-write re-triggers.
    highlights: [...s.highlights.filter((h) => !keys.includes(h.key)), ...keys.map((key) => ({ key, kind, at }))],
  }));
}

export function clearHighlight(key: string): void {
  usePresenceStore.setState((s) => ({ highlights: s.highlights.filter((h) => h.key !== key) }));
}

export function setPendingConfirmation(pending: PendingConfirmation | null): void {
  usePresenceStore.setState({ agentPresent: pending ? true : usePresenceStore.getState().agentPresent, pendingConfirmation: pending });
}

export function offerExport(exportId: string | null): void {
  usePresenceStore.setState({ offeredExportId: exportId });
}

/**
 * Ask the page to move focus to a field. The tool never touches the DOM
 * itself — the form component owns its own refs and performs the focus.
 */
export function requestFocus(key: string): void {
  usePresenceStore.setState({ agentPresent: true, focusRequest: { key, at: Date.now() } });
}

export function clearFocusRequest(): void {
  usePresenceStore.setState({ focusRequest: null });
}

/** Test/demo helper: wipe all presence state. Never called by tools. */
export function resetPresence(): void {
  usePresenceStore.setState({
    agentPresent: false,
    activities: [],
    typing: null,
    highlights: [],
    pendingConfirmation: null,
    offeredExportId: null,
    focusRequest: null,
  });
}
