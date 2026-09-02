# Submission — Careers WebMCP

**Headline:** The careers page is the connector.

**Description:** Careers WebMCP extends a normal job portal with semantic
WebMCP tools for job discovery, navigation, saved roles, and candidate
applications. The tools operate against the same live website state and
signed-in candidate session the human is already using — without an AI SDK,
MCP server, copied credentials, or DOM scraping.

**Vision:** You shouldn't install an integration for every website you visit.
The website should explain itself to your agent.

## Links

- Live demo: https://careers-webmcp.vercel.app/careers/open-positions
- Repository: https://github.com/alliecatowo/careers-webmcp
- Demo video: (to be recorded following docs/demo-script.md)

## WebMCP leverage

Careers WebMCP treats the website itself as the integration boundary. The
browser agent discovers semantic job, navigation, saved-role, and application
tools directly from the employer site the user is currently visiting. Those
tools operate using the page's current authenticated candidate session and
current application state, eliminating DOM scraping and per-site connector
installation.

## Execution

- A complete, normal careers UI that works with WebMCP absent
- One shared service/domain state for human UI and tools
- Deterministic structured search over the live catalog
- Live route context (current page, job, application, filters)
- Signed-in candidate session inherited by tools; `AUTH_REQUIRED` otherwise
- Shared saved jobs and shared application drafts
- Stale-revision protection so agent writes never overwrite human edits
- WebMCP annotations (`readOnlyHint`, `untrustedContentHint`), structured errors, bounded outputs
- Unit + Playwright integration tests, public deployment

## Impact

There are countless employer portals, school portals, support sites,
marketplaces, and other destination websites that users visit occasionally but
would never configure as permanent MCP integrations. Publisher-provided WebMCP
turns each page into a temporary semantic interface automatically available
while the user is there. This project uses careers as one concrete example of
the broader agent-native web.

## Creativity / ambition

The novelty is not job search. It is the distribution architecture: the
website owns its semantics, and the browser agent discovers them on arrival.
The web becomes its own integration registry.

## Existing project disclosure

Built on Baalvion Jobs Portal (MIT). The challenge-period work is the WebMCP
layer, live context bridge, semantic search, session, saved jobs, shared
application drafts with revision protection, tests, demo data and docs. See
`docs/CHALLENGE_DELTA.md` and `docs/UPSTREAM.md`.

## Known limitations

Fictional deterministic catalog; demo candidate session; no real employer
submission; no resume upload through WebMCP v1; no demographic fields; no
recommendation AI; single employer; requires a WebMCP-capable browser.
