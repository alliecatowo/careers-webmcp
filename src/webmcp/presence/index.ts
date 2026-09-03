export { AgentPresenceLayer } from './AgentPresenceLayer';
export { AgentSpotlight } from './AgentSpotlight';
export { useAgentHighlight, useAgentAttention, AGENT_FLASH_CLASS } from './useAgentHighlight';
export { scrollAgentTargetIntoView, scrollToTestIdWhenReady, isComfortablyInView } from './scroll';
export { typeIntoSearch } from './typing';
export { instrument, instrumentAll } from './instrument';
export {
  usePresenceStore,
  beginActivity,
  endActivity,
  dismissActivity,
  startTyping,
  advanceTyping,
  clearTyping,
  highlight,
  clearHighlight,
  setPendingConfirmation,
  offerExport,
  requestFocus,
  clearFocusRequest,
  resetPresence,
} from './presence.store';
export type { AgentActivity, ActivityPhase, PendingConfirmation, TypingState, HighlightState } from './presence.store';
