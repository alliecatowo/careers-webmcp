/**
 * Drives the "agent types into the visible search box" animation.
 *
 * The timer lives here rather than in the input component so the animation
 * survives the input not being mounted yet (the agent usually navigates to the
 * jobs index in the same tool call). The component is a pure subscriber.
 */
import { startTyping, advanceTyping, clearTyping } from './presence.store';

/** Per-character delay. Fast enough to feel deliberate, slow enough to read on video. */
const CHAR_MS = 34;
/** Held after the last character so the human sees the completed query. */
const SETTLE_MS = 260;
/** Cleared this long after commit, handing the input back to the human. */
const RELEASE_MS = 900;

export interface TypeIntoSearchOptions {
  signal?: AbortSignal;
  /** Called once the full query has been typed — commit it to the URL here. */
  onCommit: () => void;
}

/**
 * Resolves once the query has been typed and committed. Returns immediately
 * (committing synchronously) when the caller has already aborted, or when
 * running outside a browser, so tool results never depend on animation timing.
 */
export function typeIntoSearch(query: string, { signal, onCommit }: TypeIntoSearchOptions): Promise<void> {
  if (typeof window === 'undefined' || signal?.aborted) {
    onCommit();
    return Promise.resolve();
  }

  startTyping('job_search', query);

  return new Promise<void>((resolve) => {
    let index = 0;
    let timer = 0;

    const finish = () => {
      window.clearTimeout(timer);
      onCommit();
      window.setTimeout(() => clearTyping(), RELEASE_MS);
      resolve();
    };

    const step = () => {
      if (signal?.aborted) {
        clearTyping();
        onCommit();
        resolve();
        return;
      }
      index += 1;
      advanceTyping(query.slice(0, index), index >= query.length);
      if (index >= query.length) {
        timer = window.setTimeout(finish, SETTLE_MS);
        return;
      }
      timer = window.setTimeout(step, CHAR_MS);
    };

    if (query.length === 0) {
      advanceTyping('', true);
      timer = window.setTimeout(finish, SETTLE_MS);
      return;
    }
    timer = window.setTimeout(step, CHAR_MS);
  });
}
