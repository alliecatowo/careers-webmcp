'use client';
/**
 * The site's normal job search box, which also renders the agent typing into it.
 *
 * Without an agent this behaves exactly like the plain input it replaced: the
 * human types, the query is debounced into the URL. When `careers_set_search_view`
 * runs, the presence store streams the query in character by character and this
 * input displays it read-only until the animation releases, so the human sees
 * the search being composed rather than a value appearing from nowhere.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { usePresenceStore, scrollAgentTargetIntoView } from '@/webmcp/presence';

interface AgentSearchInputProps {
  /** Current `q` from the URL — the source of truth when the agent isn't typing. */
  urlQuery: string;
  onQueryChange: (value: string) => void;
}

/** Left padding of the input (`pl-10`), so the caret starts where the text does. */
const TEXT_INSET_PX = 40;

export function AgentSearchInput({ urlQuery, onQueryChange }: AgentSearchInputProps) {
  const typing = usePresenceStore((s) => (s.typing?.target === 'job_search' ? s.typing : null));
  const [humanValue, setHumanValue] = useState(urlQuery);
  const [caretX, setCaretX] = useState(TEXT_INSET_PX);
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  // Follow the URL when it changes underneath us (back/forward, agent navigation),
  // but never fight the human mid-keystroke.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setHumanValue(urlQuery);
  }, [urlQuery]);

  const agentTyping = typing !== null;
  const value = agentTyping ? typing.typed : humanValue;

  // The agent usually navigates here and starts typing in the same tool call,
  // so the search box can easily be below the fold when the animation begins.
  // A query typing itself off-screen is the same as no query at all.
  useEffect(() => {
    if (!agentTyping) return;
    const raf = requestAnimationFrame(() => scrollAgentTargetIntoView(inputRef.current));
    return () => cancelAnimationFrame(raf);
  }, [agentTyping]);

  // Track the width of the typed text so the fake caret sits at its end. The
  // mirror span copies the input's own font, so this stays correct if the
  // theme's type scale changes.
  useLayoutEffect(() => {
    if (!agentTyping || !mirrorRef.current || !inputRef.current) return;
    const width = mirrorRef.current.getBoundingClientRect().width;
    const max = inputRef.current.getBoundingClientRect().width - TEXT_INSET_PX - 8;
    setCaretX(TEXT_INSET_PX + Math.min(width, Math.max(0, max)));
  }, [value, agentTyping]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        placeholder="Search by title or keyword..."
        value={value}
        readOnly={agentTyping}
        aria-busy={agentTyping || undefined}
        data-testid="job-search-input"
        data-agent-typing={agentTyping || undefined}
        onChange={(e) => {
          if (agentTyping) return;
          setHumanValue(e.target.value);
          onQueryChange(e.target.value);
        }}
        className={
          'pl-10 transition-shadow duration-200' +
          (agentTyping ? ' ring-2 ring-sky-400/70 ring-offset-2 ring-offset-background caret-transparent' : '')
        }
      />
      {agentTyping && (
        <>
          {/* Off-screen text mirror used only to measure caret position. */}
          <span
            ref={mirrorRef}
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-0 whitespace-pre text-base md:text-sm"
          >
            {value}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 h-[1.15em] w-[2px] -translate-y-1/2 animate-pulse rounded-full bg-sky-400"
            style={{ left: caretX }}
            data-testid="agent-caret"
          />
        </>
      )}
    </div>
  );
}
