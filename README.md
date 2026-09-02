# Careers WebMCP

> The careers page is the connector.

**Live demo:** https://careers-webmcp.vercel.app/careers/open-positions · **Tool reference:** [docs/webmcp-tools.md](docs/webmcp-tools.md) · **Demo script:** [docs/demo-script.md](docs/demo-script.md)

Careers WebMCP demonstrates what agent-native destination websites can look
like.

The underlying application is a normal careers portal: humans can search
jobs, inspect openings, save roles, and manage applications without an AI
model or agent.

When WebMCP is available, the same page exposes those concepts semantically
to the browser agent already accompanying the user.

No careers-specific MCP server.
No bearer token.
No DOM scraping.
No AI SDK.

Visit the site, and the site explains itself.

| Normal careers site | Agent + human co-editing one application draft |
| --- | --- |
| ![Jobs index](docs/media/01-jobs-index.png) | ![Application co-edit](docs/media/03-application-coedit.png) |

## What it is

A fictional employer's careers site (built on the MIT-licensed
[Baalvion Jobs Portal](https://github.com/baalvionservice/Baalvion-Jobs-Portal))
running in a deterministic demo mode, plus a WebMCP layer that registers
eleven candidate-facing tools on `document.modelContext`:

| Tool | Kind | What it does |
| --- | --- | --- |
| `careers_get_context` | read | Where the user is: session, page kind, current job, current application, current filters |
| `careers_search_jobs` | read | Deterministic structured search over the live catalog (department, level, location, workplace, skills, compensation, keywords) |
| `careers_get_job` | read | One job, bounded, with the candidate's saved/applied status |
| `careers_open_job` | navigate | Opens the real job page in the user's tab |
| `careers_get_saved_jobs` | read | The signed-in candidate's saved roles |
| `careers_set_saved_job` | mutate | Same operation as the Save button |
| `careers_get_my_applications` | read | The candidate's drafts and submissions |
| `careers_get_application` | read | One application: fields, revision, missing required fields |
| `careers_start_application` | mutate | Starts (or reopens) a draft and opens the normal application form |
| `careers_update_application` | mutate | Patches only the supplied fields; rejects stale revisions |
| `careers_submit_application` | mutate | Same validation gate and submission as the human Submit button |

## Why this is WebMCP

The website already knows its job catalog, who is signed in, what is saved,
which application is open and which page the user is on. WebMCP lets it say
so, in its own vocabulary, to the agent that is already there.

| | Traditional MCP | Careers WebMCP |
| --- | --- | --- |
| Setup | User installs connector | Visit website |
| Lifetime | Persistent | Current website/session |
| Auth | Configure separately | Existing site session |
| Site context | Must recreate | Exact page/user state |
| Distribution | One integration per service | Publisher adds WebMCP |
| Best use | Headless/repeated automation | Help while visiting site |

WebMCP does not replace MCP. It covers the long tail of sites you visit
occasionally and would never configure as a permanent integration.

## The open-web thesis

Imagine every Ashby board, Greenhouse board, Lever board, Workday portal,
company careers page, university portal, event site, marketplace and support
portal exposing its own semantic capabilities. Users should not need to
install hundreds of connectors. The open web becomes discoverable. This demo
is one employer site.

### Why not scraping / browser automation?

DOM automation has to infer which card is a job, which text is compensation,
which button means Save, which route is an application and which state
belongs to the current candidate. The site already knows all of that.
Semantic tools are more reliable, structured, bounded, permission-aware,
independent of CSS selectors, and maintained by the site owner.

## Demo

1. Browse `/careers/open-positions` like any careers site. Filter, open a job, see level, workplace and compensation.
2. Click **Continue as Avery Chen** (the site's normal candidate session).
3. Ask your agent: *"What engineering roles here are staff level or above, in San Francisco or remote, with a base range starting at at least $220k?"* → `careers_search_jobs`.
4. *"Open the Staff Platform Engineer role."* → `careers_open_job` opens the real page.
5. Click **Save job** yourself. *"What have I saved?"* → `careers_get_saved_jobs` sees it.
6. *"Start an application for this one."* → the normal form opens, prefilled. The agent fills a couple of fields; you watch them appear.
7. Type your own cover note. *"Keep my changes and fill the remaining required fields."* → the agent re-reads the new revision and patches only what is missing. A stale write is refused with `STALE_APPLICATION`.

Full narration in [docs/demo-script.md](docs/demo-script.md).

## Human + agent flow

```
HUMAN  visits the careers site, signs in
AGENT  careers_search_jobs {departments:[Engineering], levels:[Staff, Senior Staff, Principal], locations:[San Francisco, Remote], minCompensation:220000}
SITE   returns exact structured openings
AGENT  careers_open_job → the normal job page opens
HUMAN  reads it, clicks Save
AGENT  careers_get_saved_jobs sees it; careers_start_application → normal form opens
AGENT  careers_update_application (revision 1) fills portfolio + availability
HUMAN  edits the cover note (revision 3)
AGENT  careers_get_application → revision 3; careers_update_application {expectedRevision: 3, fields:{phone}} → ok
       a write with expectedRevision 2 → STALE_APPLICATION, human text survives
HUMAN  clicks Submit
```

## Architecture

```
Human UI  ⇄  domain state (session · ui-context · saved-jobs · applications)  ⇄  existing services / mock adapter
                                   ⇅
                    WebMCP semantic adapter (src/webmcp)
                                   ⇅
                    document.modelContext.registerTool(...)
```

Tools are registered once per page load and read live state at call time.
Navigation tools use the app router. Nothing reads the DOM. Details in
[docs/architecture.md](docs/architecture.md).

## Security

- The agent receives no credentials. Context exposes only `{ signedIn, candidate: { id, displayName } }`.
- Candidate-scoped tools return `AUTH_REQUIRED` when signed out. There is no agent-only session path.
- Mutations run through the same domain functions and validation as the human UI.
- Job descriptions and application free text are untrusted content: tools that return them set `untrustedContentHint: true`; tool descriptions never interpolate site content.
- Outputs are bounded (10/30 search results, ~20 KB prose, ~50 KB per result) with an explicit `truncated` flag.
- A regression test serializes every tool result and asserts no token/cookie/password/API-key patterns appear.

## Existing project / challenge delta

This is built on a pre-existing open-source careers portal. The careers UI,
service adapters, admin dashboards and styling are upstream work. The
challenge contribution is the WebMCP layer, the live context bridge, the
semantic search, the shared candidate session, saved jobs, the shared
application draft with revision protection, the tests, the demo data and the
docs. The split is documented precisely in
[docs/CHALLENGE_DELTA.md](docs/CHALLENGE_DELTA.md) and
[docs/UPSTREAM.md](docs/UPSTREAM.md); deviations from the build contract are
in [docs/DECISIONS.md](docs/DECISIONS.md).

## Running locally

```bash
pnpm install
pnpm dev          # http://localhost:3000/careers/open-positions
```

`.env` sets `NEXT_PUBLIC_USE_MOCK=true`; no backend, database or credentials
are needed. Session, saved jobs and application drafts persist in the
browser's localStorage.

Without a WebMCP-capable browser you can still drive the tools: inject the
test shim from `tests/webmcp-shim.ts` (it defines `document.modelContext`)
and call `window.__webmcp.call('careers_get_context', {})` from DevTools.

## Testing

```bash
pnpm test:unit    # vitest: search, context, registration, errors, bounds, saved jobs, application revisions, secret leakage
pnpm test:e2e     # playwright: no-WebMCP, registration, shared route, shared save, application co-edit + stale protection, submission, auth-required
```

## Limitations

- Fictional, deterministic 15-job catalog for a single employer
- Demo candidate session (no real identity provider)
- No real employer submission pipeline; no resume upload through WebMCP v1
- No demographic or sensitive hiring fields by design
- No job recommendation AI; search is a deterministic scorer
- Requires a browser with WebMCP support; otherwise it is simply a careers site

This is a protocol demo, not production ATS software.

## License / upstream attribution

MIT (see [LICENSE](LICENSE)). Based on
[Baalvion Jobs Portal](https://github.com/baalvionservice/Baalvion-Jobs-Portal),
imported at commit `9108409` (2026-04-14), the last upstream commit published
under its README's MIT declaration; upstream later switched to a proprietary
license for subsequent versions, which is why this project pins that commit.
The visible employer in this demo is the fictional "Northwind"; "Baalvion" is
used only for attribution. Details in [docs/UPSTREAM.md](docs/UPSTREAM.md).
