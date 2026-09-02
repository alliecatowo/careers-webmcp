# Demo script (≈3 minutes)

Setup: a WebMCP-capable browser (or the Playwright shim for a recorded run),
the deployed site open at `/careers/open-positions`, signed out, fresh storage.

## Scene 1 — It's just a careers site (20s)

Show the jobs list. Filter by department "Engineering", open **Staff Platform
Engineer**, scroll to show level, workplace, compensation range and skills.

> "This is just a careers site. Without WebMCP you browse jobs, save roles and apply like on any employer portal."

## Scene 2 — Sign in (10s)

Click **Continue as Avery Chen** in the header. No agent yet.

> "That's the site's normal candidate session."

## Scene 3 — Semantic search (30s)

Ask the browser agent:

> "What engineering roles here are staff level or above, in San Francisco or remote, with a base range starting at at least $220k?"

Agent calls `careers_search_jobs` with departments, levels, locations and
minCompensation. Result: Staff Platform Engineer, Staff AI Infrastructure
Engineer, Principal Reliability Engineer, Senior Staff Engineer (Compute).

> "No scraping, no connector installed. The page told the agent what a job is."

## Scene 4 — Agent navigates the real site (15s)

> "Open the Staff Platform Engineer role."

Agent calls `careers_open_job`. The normal job page opens. Scroll it.

## Scene 5 — Human action, agent sees it (20s)

Click the normal **Save job** button yourself. Then ask:

> "What have I saved?"

Agent calls `careers_get_saved_jobs`; the role is there.

## Scene 6 — Start an application (30s)

> "Start an application for this one."

Agent calls `careers_start_application`. The normal application page opens
with Avery's profile prefilled. Ask the agent to set the portfolio URL to
`https://averychen.dev` and availability to "Available from October 2026".
Fields update on screen; the revision counter increments.

## Scene 7 — Co-editing with revision protection (40s)

Type your own cover note into the form. Then:

> "Keep my changes and fill any remaining required fields. My phone is +1 555 0100."

Agent calls `careers_get_application` (sees the new revision and your cover
note), then `careers_update_application` with that revision, setting only
`phone`. Your cover note is untouched.

Optional: show a stale write being refused by calling update with the old
revision (in the shim: `window.__webmcp.call('careers_update_application', { applicationId, expectedRevision: <old>, fields: { coverNote: 'x' } })` → `STALE_APPLICATION`).

Click **Submit application** yourself.

## Close (10s)

> "You shouldn't install an integration for every website you visit. With WebMCP, the website itself can be the connector."

## Recording without a WebMCP browser

Run `pnpm test:e2e --headed --project=chromium tests/e2e/application.spec.ts`
or open the site with the shim from `tests/webmcp-shim.ts` injected via
DevTools snippet, then drive tools from the console with
`window.__webmcp.call(name, input)`.
