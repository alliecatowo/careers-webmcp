# Submission — Careers WebMCP

**Headline:** The careers page is the connector.

**Description:** Careers WebMCP extends a normal job portal with 16 semantic
WebMCP tools for job discovery, navigation, saved roles, candidate
applications, account creation and bulk export. The tools operate against the
same live website state and signed-in candidate session the human is already
using — without an AI SDK, MCP server, copied credentials, or DOM scraping.
The two irreversible actions, creating an account and submitting an
application, are prepared by the agent and completed by a human click.

**Vision:** You shouldn't install an integration for every website you visit.
The website should explain itself to your agent.

## Links

- Live demo: https://careers-webmcp.vercel.app/careers/open-positions
- Repository: https://github.com/alliecatowo/careers-webmcp
- Demo video: (to be recorded following docs/demo-script.md)

## WebMCP leverage

Careers WebMCP treats the website itself as the integration boundary. The
browser agent discovers semantic job, navigation, saved-role, application,
sign-up and export tools directly from the employer site the user is currently
visiting. Those tools operate using the page's current authenticated candidate
session and current application state, eliminating DOM scraping and per-site
connector installation.

Because the publisher owns the tools, it also owns where they stop. Two
capabilities are exposed but deliberately do not complete:
`careers_create_account` fills the site's real sign-up form and
`careers_submit_application` validates the draft and opens it — both return
`status: "awaiting_human_confirmation"`. There is no `confirm: true` escape
hatch and no second code path: the site has exactly one way to create a session
and one way to send an application, and both are behind a human click. The
agent does the grinding; the person keeps the decision.

Publisher ownership also means the agent's work is visible in the real UI
rather than in a side panel. `src/webmcp/presence/` wraps each tool's `execute`
at registration time and pushes to a store the normal components subscribe to:
the query is typed into the site's own search box character by character, the
fields the agent wrote flash, and the Submit button it is waiting on is
highlighted. The wrapper never alters a tool result, swallows its own errors,
and renders nothing at all until a tool is actually invoked.

## Execution

- A complete, normal careers UI that works with WebMCP absent
- 16 candidate-facing tools registered once per page load, feature-detected
- One shared service/domain state for human UI and tools
- Deterministic structured search over a 20-job catalog spanning $165k-$575k
- One scorer: `filterAndRankJobs` backs both the visible jobs listing and the search tools, so the page and the agent cannot disagree about what matched
- Live route context (current page, job, application, filters)
- Signed-in candidate session inherited by tools; `AUTH_REQUIRED` otherwise
- Shared saved jobs and shared application drafts
- Stale-revision protection so agent writes never overwrite human edits
- Human-confirmation hand-off: `careers_create_account` and `careers_submit_application` stage the real form and stop; only a human click creates a session or sends an application
- Agent-prepared account creation against a sign-up draft store distinct from the session store
- Agent presence rendered by the site's own components — typed search query, field flashes, hand-off cue — with no chat panel and no way to summon an agent
- Handle-based exports: the agent gets `{ exportId, rowCount, columns, preview }` and reads bounded, column-projected slices, so a full result set never enters a tool result; the same CSV downloads from the jobs page
- WebMCP annotations (`readOnlyHint`, `untrustedContentHint`), structured errors, bounded outputs
- Unit + Playwright integration tests, public deployment

## Impact

There are countless employer portals, school portals, support sites,
marketplaces, and other destination websites that users visit occasionally but
would never configure as permanent MCP integrations. Publisher-provided WebMCP
turns each page into a temporary semantic interface automatically available
while the user is there. This project uses careers as one concrete example of
the broader agent-native web.

Careers is a useful example because the friction is specific. Candidate funnels
lose people at "create an account" — a form standing between someone and a job
they have already decided to apply for. A publisher-provided tool can fill that
form from what the person already told their agent and hand it back for one
click, without the site ever granting the agent the ability to create the
account itself. The same shape applies to any destination site where the work
is data entry and the decision is not.

## Creativity / ambition

The novelty is not job search. It is the distribution architecture: the
website owns its semantics, and the browser agent discovers them on arrival.
The web becomes its own integration registry.

## Existing project disclosure

Built on Baalvion Jobs Portal (MIT). The challenge-period work is the WebMCP
layer, live context bridge, semantic search, session, saved jobs, shared
application drafts with revision protection, the human-confirmation hand-off,
the sign-up page and draft store, the agent presence layer, handle-based
exports, tests, demo data and docs. See `docs/CHALLENGE_DELTA.md` and
`docs/UPSTREAM.md`.

## Known limitations

Fictional deterministic 20-job catalog; demo candidate session; no real
employer submission; account creation and application submission always require
a human click, by design; exports are tab-scoped and disappear when the tab
closes; no resume upload through WebMCP v1; no demographic fields; no
recommendation AI; single employer; requires a WebMCP-capable browser.
