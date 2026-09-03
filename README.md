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
sixteen candidate-facing tools on `document.modelContext`:

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
| `careers_submit_application` | hand-off | Runs the human Submit button's validation gate, then opens the draft for the person to send; does not submit |
| `careers_set_search_view` | navigate | Puts a search on the site's own jobs page: types the query into the visible box and applies the visible filters |
| `careers_focus_application_field` | navigate | Moves the cursor to one application field and highlights it, for answers the agent should not invent |
| `careers_create_account` | hand-off | Fills the normal sign-up form with details the person supplied; does not create the account |
| `careers_create_export` | mutate | Builds a downloadable CSV of jobs or applications and returns a handle: row count, columns, three-row preview, download URL |
| `careers_read_export` | read | Reads a bounded window of an export's rows, projected to the requested columns (max 100 per call) |

## What the agent cannot do

Two of the sixteen tools stop one step short of finishing. `careers_create_account`
fills the site's real sign-up form and returns; `careers_submit_application`
validates the draft against the same rules the human form uses, opens the
application page and highlights the real Submit button. Both return
`status: "awaiting_human_confirmation"`. Neither completes.

There is no `confirm: true` escape hatch, because there is no second code path
to reach. The site has exactly one function that creates a session, called only
by the human-clicked **Create account** button, and exactly one that submits an
application, called only by the human-clicked **Submit Application** button. The
tools write drafts; the buttons commit.

| Tool | What it does | What only the human can do |
| --- | --- | --- |
| `careers_create_account` | Fills the real sign-up form and opens it | Press **Create account**, which creates the session |
| `careers_submit_application` | Validates the draft and opens it for review | Press **Submit Application**, which sends it |

This is a design position, not an unfinished feature. An agent that can silently
create accounts and fire off job applications on a real careers site is a
liability for the candidate and the employer both, and the identity and the
irreversible send are the two steps a person actually wants to own. It is also
the better demo: the human stays visibly in the loop, and the agent's work is
something you approve rather than something you discover afterwards.

## Seeing the agent work

With no agent, the site renders zero extra DOM. The presence layer returns
`null` until a tool is actually invoked, so a normal visitor never sees a trace
of it and there is nothing to opt out of.

When a tool does run, the page shows what happened: a scan bar across the top,
one activity pill at a time naming the action, the query typed
character-by-character into the site's own search box, and a flash on exactly
the form fields that changed. The pill is a report, not a control.

Presence labels and captions are authored strings and counts only. Nothing in
them is interpolated from job descriptions or application text, because that
content is untrusted (BUILD_CONTRACT §36) and a caption is still a place a
prompt injection could land. The layer also cannot summon or prompt an agent —
there is no chat panel, no prompt box, no way to start anything. It only
reports what already happened.

## Exports without dumping rows

A WebMCP tool result is a plain JavaScript value. There is no file handle in
the protocol and no streaming, so "give me every matching job" would mean
serializing the whole result set into one payload — which blows the output
bounds long before it is useful.

So `careers_create_export` builds a real CSV once and returns a handle instead
of rows: `exportId`, `rowCount`, `columns`, a three-row preview and a
`downloadUrl`. The agent then pulls windows out of it with
`careers_read_export`, choosing an offset, a limit of up to 100 rows, and only
the columns it needs. The human downloads the identical file from the **Export
CSV** button on the jobs page or from `/careers/exports/[id]`.

The effect is that an agent can reason over a full result set — count it, scan
it column by column, page through all of it — without any single tool result
approaching the 50KB bound.

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

- Fictional, deterministic 20-job catalog for a single employer, spanning $165k-$575k and including five frontier-lab roles
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
