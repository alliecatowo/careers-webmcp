'use client';
/**
 * The visible echo of agent activity. Renders `null` — no DOM at all — until a
 * WebMCP tool has actually run on this page load, so the normal careers site is
 * completely unchanged for a human browsing without an agent.
 *
 * This is deliberately NOT a chat panel, sidebar, or "Ask AI" affordance: it
 * cannot start, prompt, or talk to an agent. It only reports what already
 * happened. See docs/DECISIONS.md.
 */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDownToLine, Check, CornerDownRight, X } from 'lucide-react';
import {
  usePresenceStore,
  dismissActivity,
  offerExport,
  setPendingConfirmation,
  type AgentActivity,
  type PendingConfirmation,
} from './presence.store';
import { scrollToTestIdWhenReady } from './scroll';

/** How long a finished activity stays on screen before fading out. */
const LINGER_MS = 2600;
/** How long the download offer stays up before it stops competing for attention. */
const EXPORT_OFFER_MS = 14_000;

function ActivityDot({ phase }: { phase: AgentActivity['phase'] }) {
  if (phase === 'done') {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
        <Check className="h-2.5 w-2.5 text-emerald-400" strokeWidth={3} />
      </span>
    );
  }
  if (phase === 'error') {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/20">
        <X className="h-2.5 w-2.5 text-red-400" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
      <span className="absolute h-4 w-4 animate-ping rounded-full bg-sky-400/40" />
      <span className="relative h-1.5 w-1.5 rounded-full bg-sky-400" />
    </span>
  );
}

/** Auto-dismisses a finished activity after it has been read. */
function useAutoDismiss(activities: AgentActivity[]) {
  useEffect(() => {
    const timers = activities
      .filter((a) => a.phase !== 'running')
      .map((a) => {
        const remaining = Math.max(0, LINGER_MS - (Date.now() - (a.endedAt ?? Date.now())));
        return window.setTimeout(() => dismissActivity(a.id), remaining);
      });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [activities]);
}

/** The download offer is a convenience, not a task; it should not linger forever. */
function useExpiringExportOffer(exportId: string | null) {
  useEffect(() => {
    if (!exportId) return;
    const timer = window.setTimeout(() => offerExport(null), EXPORT_OFFER_MS);
    return () => window.clearTimeout(timer);
  }, [exportId]);
}

/**
 * Bring the control the human has to press into the middle of the viewport.
 * Without this the hand-off pill can end up sitting on top of the very button
 * it is pointing at. The hand-off usually fires in the same tick as the
 * navigation, so retry briefly until the target page has mounted it.
 */
function useScrollToPendingTarget(pending: PendingConfirmation | null) {
  const testId = pending?.targetTestId ?? null;
  useEffect(() => {
    if (!testId) return;
    return scrollToTestIdWhenReady(testId);
  }, [testId]);
}

function ScanBar({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="scan"
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden
        >
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
            animate={{ x: ['-40%', '340%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AgentPresenceLayer() {
  const agentPresent = usePresenceStore((s) => s.agentPresent);
  const activities = usePresenceStore((s) => s.activities);
  const pending = usePresenceStore((s) => s.pendingConfirmation);
  const offeredExportId = usePresenceStore((s) => s.offeredExportId);

  // Avoid an SSR/CSR mismatch: presence is a purely client-side runtime signal.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useAutoDismiss(activities);
  useExpiringExportOffer(offeredExportId);
  useScrollToPendingTarget(pending);

  if (!mounted || !agentPresent) return null;

  const running = activities.some((a) => a.phase === 'running');
  // One line at a time. A stack of pills reads as clutter and covers the page
  // the agent is supposed to be showing off.
  const visible = activities.slice(-1);
  // When the human has something to do, the download offer waits its turn.
  const showExportOffer = offeredExportId && !pending;

  return (
    <>
      <ScanBar active={running} />
      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[60] flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-2"
        data-testid="agent-presence"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {pending && (
            <motion.div
              key="pending"
              layout
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-950/85 px-4 py-2 text-sm text-amber-100 shadow-lg backdrop-blur"
              data-testid="agent-pending-confirmation"
            >
              <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-amber-300" />
              <span>{pending.label}</span>
              <span className="text-amber-300/70">Your move.</span>
              <button
                type="button"
                onClick={() => setPendingConfirmation(null)}
                aria-label="Dismiss"
                data-testid="agent-pending-dismiss"
                className="-mr-1 rounded-full p-1 text-amber-300/60 transition-colors hover:bg-amber-400/10 hover:text-amber-200"
              >
                <X className="h-3 w-3" strokeWidth={3} />
              </button>
            </motion.div>
          )}

          {showExportOffer && (
            <motion.div
              key="export"
              layout
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="pointer-events-auto"
            >
              <Link
                href={`/careers/exports/${offeredExportId}`}
                className="flex items-center gap-2 rounded-full border border-sky-400/30 bg-slate-900/90 px-4 py-2 text-sm text-slate-100 shadow-lg backdrop-blur transition-colors hover:border-sky-400/60"
                data-testid="agent-export-offer"
              >
                <ArrowDownToLine className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span>Agent prepared an export</span>
                <span className="text-sky-300/80">Download</span>
              </Link>
            </motion.div>
          )}

          {visible.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-sm text-slate-100 shadow-lg backdrop-blur"
              data-testid="agent-activity"
              data-tool={a.tool}
              data-phase={a.phase}
            >
              <ActivityDot phase={a.phase} />
              <span className="font-medium">{a.label}</span>
              {a.detail && <span className="text-slate-400">· {a.detail}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
