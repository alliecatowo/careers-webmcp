# SUBMISSION.md — internal submission packet

Working document for building the Devpost entry. **This filename is not
required by the hackathon**; it exists so every value the form needs lives in
one place. Judges read [README.md](README.md), not this file.

---

## 1. Official rules — verified

**Verified:** 2026-09-02 19:53 PDT (2026-09-03 02:53 UTC) by fetching the pages
below.

| What | URL |
| --- | --- |
| Hackathon home / submission requirements | https://webmcp.devpost.com/ |
| Official rules | https://webmcp.devpost.com/rules |
| OpenAI challenge page | https://openai.com/webmcp-challenge/ |

**Dates (all Pacific):**

| Milestone | When |
| --- | --- |
| Submission period | 2026-08-25 11:00 → **2026-09-03 13:00 PT** |
| Judging | 2026-09-04 10:00 → 2026-09-21 17:00 PT |
| Winners announced | on or around 2026-09-23 14:00 PT |

**Requirement text, quoted from the rules page:**

- Working live URL "accessible using ChatGPT's in-app browser or Google Chrome with WebMCP enabled."
- Text description that "explains why your use case is a strong fit for WebMCP, how it creates a better user experience, describe what people and agents can do together that was difficult or impossible before, briefly explain how you implemented WebMCP."
- Public code repository (GitHub, GitLab, Bitbucket) "containing all source code, assets, and instructions."
- Open source license file "detectable and visible at the top of the repository page."
- Demo video: "must be less than three (3) minutes"; "must include a clear demo of your project functioning and with audio that covers what you built and how you used WebMCP"; "must be uploaded to and made publicly visible on YouTube"; no third-party trademarks or copyrighted music.
- All materials in English.
- Existing projects: "must have been meaningfully extended using WebMCP after the Submission Period start date. Pre-existing Projects will be evaluated only on work added during the Submission Period," with "clear documentation distinguishing prior work from new work, including evidence that it was meaningfully extended with WebMCP within the Submission Period (e.g., timestamped, dated commit history, or equivalent)."

**Judging:** Stage One is pass/fail on theme fit and genuine use of the featured
APIs. Stage Two is four **equally weighted** criteria — WebMCP Leverage,
Execution, Potential Impact, Creativity & Ambition (exact wording in §7).

---

## 2. Compliance matrix

| Requirement | Status | Evidence |
| --- | --- | --- |
| Live URL, publicly reachable | PASS | `https://careers-webmcp.vercel.app/careers/open-positions` returns HTTP 200 anonymously (checked 2026-09-02 19:53 PDT). No Vercel deployment protection; the alias URL is the public one. |
| Works in ChatGPT in-app browser / Chrome with WebMCP | **NEEDS HUMAN CHECK** | Feature-detected registration on `document.modelContext`, verified via the test shim and Playwright. No human has confirmed a real agent end to end. See CHECKLIST.md. |
| Text description covering all four required points | PASS | §5 below, paste-ready. Same content in README.md: "The argument", "The problem this actually solves", "Why WebMCP specifically", "What humans and agents do together here", "How it's implemented". |
| Public repo with all source, assets, instructions | PASS | https://github.com/alliecatowo/careers-webmcp — public; README carries local-run and testing instructions. |
| OSS license detectable at top of repo page | PASS | `LICENSE` is canonical MIT text; GitHub reports `licenseInfo.key = "mit"`, so the About sidebar shows "MIT License". |
| Demo video <3 min, public YouTube, audio covering what + how | **NOT DONE** | Playbook: [DEMO.md](DEMO.md). The one blocking item. |
| English | PASS | All materials English. |
| Existing project extended in-period with dated commit evidence | PASS | All commits dated 2026-09-02, inside 08-25 → 09-03. First commit is the untouched upstream import; every later commit is challenge work. `docs/CHALLENGE_DELTA.md` itemizes it. |
| No third-party trademarks / copyrighted music in video | **ENFORCE IN PRODUCTION** | Employer brand on screen is the fictional "Northwind". Use no music. |

---

## 3. Identity

| Field | Value |
| --- | --- |
| Project name | **Careers WebMCP** |
| Tagline | The careers page is the connector. |
| One-liner | A careers site that hands its own capabilities to whatever browser agent arrives with the visitor — and keeps the two irreversible actions behind a human click, structurally. |

---

## 4. Exact Devpost form values

| Field | Value |
| --- | --- |
| Project name | `Careers WebMCP` |
| Tagline | `The careers page is the connector.` |
| Live/try-it URL | `https://careers-webmcp.vercel.app/careers/open-positions` |
| Repository URL | `https://github.com/alliecatowo/careers-webmcp` |
| YouTube video URL | *(fill after upload)* |
| Built with | `webmcp`, `typescript`, `nextjs`, `react`, `tailwindcss`, `zustand`, `vercel`, `playwright`, `vitest` |
| License | MIT |
| Submitted commit SHA | *(fill at submission — see §9)* |

---

## 5. Paste-ready Devpost description

> **Careers WebMCP — the careers page is the connector.**
>
> **The argument.** Every way an agent can help you on a website today requires
> taking your authority and handing it to the agent. A scraper gets your whole
> session and guesses meaning from markup. An MCP connector gets a token you
> pasted and acts on your behalf forever, out of sight of the page. In both
> cases the agent's power is a copy of yours, and the site has no say in what
> it can do.
>
> WebMCP inverts that: **the publisher defines the capabilities, so the
> publisher defines the limits.** That is the whole reason this project exists.
> A careers site can expose "fill in my application" while making "submit it"
> structurally impossible for an agent — not guarded, not confirmed,
> impossible — because the site owns both the tool surface and the code behind
> it.
>
> **The problem.** Job seekers do an enormous amount of unpaid data entry, and
> candidate funnels leak in three predictable places: search that can't answer
> the question you actually have ("staff or above, SF or remote, at least
> $220k" is not a keyword); the account wall standing between a person and a
> role they have already decided to apply for; and retyping the same nine
> fields at every employer. All three are data entry. None of them is a
> decision. The audience is candidates browsing employer career sites — and the
> employers who lose them.
>
> **Why WebMCP specifically.** A careers site is a destination you visit
> occasionally and would never configure as a permanent integration. Nobody
> installs an MCP connector for one employer's job board, uses it for ninety
> minutes, and maintains it. WebMCP covers exactly that long tail: the
> capability arrives with the page, runs on the session the human already has,
> and leaves when the visit ends.
>
> **What it is.** A working careers portal for a fictional employer, fully
> usable with no agent present. When WebMCP is available it registers eighteen
> candidate-facing tools on `document.modelContext`: page context, semantic job
> search, job detail, navigation to any page on the site by name, control of
> the site's own search view, the employer's own careers content as structured
> data, saved jobs, application drafts with revision-safe patching, field focus,
> account sign-up, submission hand-off, and handle-based CSV export.
>
> **What people and agents can do together that was hard before.** You ask one
> compound question the board has no filter UI for, and the agent answers it
> *and applies it to the page you are looking at* — typing into the site's own
> search box, character by character, while the visible list narrows. You click
> Save with your own hand and the agent sees it, because it reads the same
> store the button writes to, not a copy. You and the agent co-edit one
> application draft: it fills the empty fields, you write your own cover note,
> and every agent write carries the revision it last read, so a stale write is
> rejected with `STALE_APPLICATION` and your text always wins. And the agent
> can reason over the entire catalog without pulling twenty job descriptions
> into its context, because the site hands it a CSV handle it pages through.
>
> **Where the agent stops, and why you can verify it.** Two tools deliberately
> never complete. `careers_create_account` fills the real sign-up form and
> returns; `careers_submit_application` runs the same validation the human
> Submit button runs, opens the draft and rings the button. Both return
> `status: "awaiting_human_confirmation"`. There is no `confirm: true` escape
> hatch because there is no second code path: `src/webmcp/tools.ts` never
> imports the function that submits an application or the function that creates
> a session, and each of those has exactly one caller in the entire codebase,
> both inside a human-clicked button. One grep proves it. The agent does the
> typing; the person stays the person, and sends the thing.
>
> **How WebMCP was implemented.** A client provider feature-detects
> `document.modelContext` and registers eighteen tools once per page load,
> unregistering via an `AbortSignal`, guarded by a `WeakSet` against React
> StrictMode double-mounts; registration failure is swallowed so it can never
> break the site. Nothing reads or drives the DOM. The human UI and the tools
> import the *same module-level functions* from `src/domain/*` — search runs
> `filterAndRankJobs`, the identical deterministic scorer behind the visible
> job list, so the page and the agent cannot disagree about what matched;
> mutations run the same validators as the form; navigation uses the app
> router, so the user's real tab moves. Context isn't scraped or parsed: the
> pages publish it, with a `CurrentJobBridge` and `CurrentApplicationBridge`
> rendered by the components that already know. Tools carry JSON Schema inputs,
> WebMCP annotations (`readOnlyHint`, `untrustedContentHint`), `AbortSignal`
> support, a structured recoverable error model, and central output bounds with
> a `truncated` flag. Bulk data is exposed as a handle rather than rows,
> because a WebMCP result is a plain value with no file handle and no
> streaming. A presence layer wraps each tool's `execute` at registration and
> pushes to a store the site's normal components subscribe to, so the agent's
> work appears in the real UI — and it renders no DOM at all until a tool
> actually runs, never alters a result, and builds its captions from counts and
> enums only, never from site text, so a prompt injection in a job description
> has nowhere to land.
>
> No LLM, no AI SDK, no chat panel, no MCP server, no recommendation model, no
> DOM automation. The site is the integration.
>
> **The bigger picture.** Imagine every Greenhouse board, Workday portal,
> university portal, marketplace and support site exposing its own semantics
> this way. Nobody installs hundreds of connectors; the open web becomes its
> own integration registry. This demo is one employer site.
>
> Built on the MIT-licensed Baalvion Jobs Portal. The careers UI and admin
> dashboards are upstream; the WebMCP layer, presence layer, context bridge,
> semantic search, candidate session, saved jobs, revision-protected
> application drafts, sign-up hand-off, exports, tests and docs are the
> challenge-period contribution. See `docs/CHALLENGE_DELTA.md`.

---

## 6. Testing instructions for judges

Paste into the Devpost testing-instructions field:

> **Live URL:** https://careers-webmcp.vercel.app/careers/open-positions
> **Credentials:** none. Click **Continue as Avery Chen** in the header for the
> site's normal demo candidate session (no password, no token) — or ask the
> agent to set up an account and press **Create account** yourself.
>
> 1. Open the URL. It is a normal careers site; no agent UI is visible until a tool actually runs.
> 2. Ask your agent: *"I'm on this careers site. Find me engineering roles at staff level or above, in San Francisco or remote, paying at least $220k base."* → `careers_search_jobs` returns 6 matches.
> 3. *"Show me that search on the page."* → `careers_set_search_view` types the query into the site's own search box and applies the visible filters.
> 4. Sign in (header → **Continue as Avery Chen**). Click **Save job** on a role with your own hand, then ask *"What have I saved?"* → `careers_get_saved_jobs` sees your click.
> 5. *"Start an application for that role and fill in what you can."* → the normal application form opens and fills in front of you.
> 6. Type your own cover note into the form, then ask the agent to fill whatever is still missing. Your text survives; a write carrying an old revision is refused with `STALE_APPLICATION`.
> 7. *"Is it ready to send?"* → `careers_submit_application` validates and rings **Submit Application**, then stops. It cannot press it; you can.
> 8. *"Pull every open role and tell me which team has the widest pay bands."* → `careers_create_export` returns a handle and `careers_read_export` pages through it; the same CSV downloads from the **Export CSV** button.
> 9. Sign out and retry step 4 → `AUTH_REQUIRED`. There is no agent-only session path.
>
> Without WebMCP the site is unchanged and fully usable.
>
> **No WebMCP-capable browser?** Inject `tests/webmcp-shim.ts` and call
> `window.__webmcp.call('careers_get_context', {})` from DevTools, or run
> `PLAYWRIGHT_BASE_URL=https://careers-webmcp.vercel.app pnpm test:e2e`.

**Credentials:** none. No accounts, passwords, API keys or env vars for a judge
to obtain.

---

## 7. Evidence against the four judging criteria

### WebMCP Leverage
> *"How thoroughly and skillfully does the project use WebMCP? Does the code reflect genuine effort and a working, non-trivial implementation?"*

**Breadth.** 18 tools across five kinds — read, navigate, mutate, focus,
hand-off — covering the site's whole candidate surface, not one search tool
with a wrapper.

**Protocol hygiene.** JSON Schema inputs with per-tool validation;
`readOnlyHint` and `untrustedContentHint` annotations; `AbortSignal` honoured
in every `execute`; central output bounds (10/30 results, ~20KB prose, ~50KB
result, arrays capped at 50) with an explicit `truncated` flag; registration
once per page load behind a `WeakSet` guard with `AbortSignal` teardown, and
registration failure swallowed so it can never break the site.

**Three pieces of real protocol design work, not feature count:**

1. **Bulk data as a handle.** A WebMCP result is a plain JavaScript value — no file handles, no streaming — so a full result set cannot be returned. `careers_create_export` builds a CSV once and returns `{exportId, rowCount, columns, preview, downloadUrl, readHint}`; `careers_read_export` pages through it with column projection and `hasMore`. Exports call the *unbounded* ranker deliberately, because export rows never enter a tool result. The human downloads the identical file.
2. **Optimistic concurrency in the tool surface.** Every draft carries a monotonic `revision`; every read returns it; every write may carry `expectedRevision` and is rejected with `STALE_APPLICATION` (carrying both revisions) on mismatch. Two deliberate refinements: `expectedRevision: null` skips the check entirely, because *human* writes always win; and a no-op patch doesn't bump the revision, so a controlled-input echo can't spin it out from under a well-behaved agent.
3. **Publisher-enforced stopping points.** `careers_create_account` and `careers_submit_application` return `awaiting_human_confirmation` and cannot complete — verifiable in one grep: `grep -cE "submitApplication\(|completeSignUp\(" src/webmcp/tools.ts` → 0, and each function has exactly one caller in the app, both inside an onClick.

**The whole site is addressable from anywhere.** The provider is in the root
layout, so tools register on every page — an agent meeting the user on the home
page can search the catalog before the human has seen a job card.
`careers_open_page` takes a destination enum that *is* the site map, shipped in
the JSON Schema, so the agent never reconstructs a link or scrapes an `<a href>`;
`careers_get_context` returns the same list annotated with `requiresAuth` and
`available`. `careers_get_site_info` is the read half — the employer's hiring
process and internship program as structured data, imported by the
informational pages themselves, so the agent cannot describe a page the human
isn't looking at.

**Zero DOM automation, and context that isn't inferred.** Tools call domain
functions; navigation uses the Next.js router. `careers_get_context` doesn't
scrape or primarily parse the URL — the pages publish their own context through
`CurrentJobBridge` / `CurrentApplicationBridge` / `PageContextBridge`, so the
component that *knows* which job it is announces it. `careers_focus_application_field`
is executed by the form component that owns the ref, not by a selector lookup
from a tool.

**Recoverable errors.** `STALE_APPLICATION` carries `expectedRevision` and
`currentRevision`; a submit `VALIDATION_ERROR` carries `missingRequiredFields`;
an unknown department in `careers_set_search_view` comes back with the list of
departments the site actually knows — so the agent fixes itself in one turn
instead of guessing. Unknown throws collapse to a generic `INTERNAL_ERROR`; no
stack traces, ever.

### Execution
> *"Does the project deliver a working or runnable project that has a complete, coherent product experience — not just a technical proof of concept?"*

- Deployed, public, no credentials: https://careers-webmcp.vercel.app/careers/open-positions
- **The site is fully usable with WebMCP absent** — browse, filter, sign in, save, apply, submit. That is the contract the entire design rests on, and it is enforced by a Playwright test.
- **One state, not two.** The human UI and the tools import the same module-level functions. `filterAndRankJobs` backs both the visible listing and the search tools; one saved-jobs store behind the Save button and `careers_set_saved_job`; one draft behind the form and the update tools.
- **The agent's work lands in the product UI** — scan bar, one activity pill, the query typing into the site's real search box, per-field flashes, job-title spotlight, an amber ring on the button it's waiting for — with no chat panel and no way to summon an agent. The wrapper never alters a tool result and swallows its own errors in every branch, so a presence bug cannot break a tool call. The typing animation commits synchronously when aborted or server-side, so a tool result never depends on animation timing.
- **Tests.** 15 Vitest files (search, normalization, context, registration, schemas, errors, bounds, saved jobs, application revisions, signup, exports, presence, agent surface) including a regression that serializes every tool's output under a signed-in session and asserts nothing matching `/password|token|jwt|cookie|secret|apiKey|AIza/i` appears; 12 Playwright specs (no-WebMCP, registration, context, open-job, search, saved, application co-edit + stale protection, human-confirmed submission, account hand-off, exports, presence, auth).
- **Documented.** README, `docs/architecture.md`, `docs/webmcp-tools.md` (per-tool inputs, outputs, error shapes), `docs/DECISIONS.md`, `docs/CHALLENGE_DELTA.md`, `docs/UPSTREAM.md`.

### Potential Impact
> *"Does the project make a credible, specific case for solving a real problem for a real audience — and does the solution actually address that problem based on what's demonstrated?"*

- **Specific audience, specific leaks.** Candidate funnels lose people at search that can't express the real question, at the account wall, and at repeated form entry. All three are demonstrated, not asserted.
- **The solution matches the problem exactly.** The friction removed is data entry. The decisions preserved are identity and the irreversible send. The two hand-off tools are that line drawn in code rather than in a policy doc.
- **An employer would plausibly ship this**, which is the real test of impact. A careers site that let agents create accounts and fire off applications is a liability for the candidate and a spam firehose for the employer. One that lets an agent *prepare* work a human approves is strictly better for both and costs the candidate nothing. Publisher-owned limits are what make agentic browsing acceptable on a site with real consequences.
- **It generalizes without hand-waving.** The shape — publisher exposes semantics, agent does the data entry, human owns the commit — applies to any destination site you visit occasionally: school portals, permit sites, support portals, marketplaces. The demo is one employer because the argument is about distribution, not about jobs.
- **Safety is part of the impact case.** Tools returning job or application prose set `untrustedContentHint: true`; tool descriptions never interpolate site content; presence captions are built from counts and enums only (`totalMatches`, `rowCount`, `updatedFieldCount`), so a prompt injection in a job description has nowhere to land. The agent never receives credentials — `getSessionSummary()` returns exactly `{signedIn, candidate:{id, displayName}}`.

### Creativity & Ambition
> *"How creative and novel is the concept and does the project differ from existing concepts?"*

- **The novelty is not job search. It is where authority lives.** Scrapers and MCP connectors both work by copying the user's authority to the agent. WebMCP lets the publisher decide what is delegable at all — and this project is built entirely around that inversion rather than treating it as a footnote.
- **Deliberate incompleteness as the headline feature.** Most agent demos race toward full autonomy. This one ships two capabilities that structurally cannot finish, and argues that publisher-enforced stopping points are the precondition for agents touching sites with real consequences.
- **Agent presence rendered by the product's own components.** The agent's activity appears in the real UI — the query types itself into the real search box — rather than in a side panel. And the page renders nothing at all until a tool runs, and offers no way to summon an agent: presence is a report, never a control.
- **A protocol-level answer to bulk data.** Handle-based exports respond to a genuine WebMCP constraint (plain-value results, no streaming, hard bounds) instead of bolting on a feature.
- **The distribution thesis.** The website owns its semantics; the visiting agent discovers them on arrival; the open web becomes its own integration registry, with no connector directory in the middle.

---

## 8. Existing project disclosure

Built on [Baalvion Jobs Portal](https://github.com/baalvionservice/Baalvion-Jobs-Portal)
(MIT), imported at upstream commit `9108409` (2026-04-14) — the last upstream
commit published under its README's MIT declaration; upstream later relicensed,
which is why this project pins that commit. Photos of real people were
excluded; the visible brand was renamed to the fictional "Northwind".

**Upstream (not the contribution):** Next.js 14 app-router project, careers
listing and detail pages, country-scoped routes, candidate account area, admin
and recruiter dashboards, the service/adapter architecture, the visual design
system.

**Challenge-period contribution:** the WebMCP layer (`src/webmcp/`) and all 18
tools; the agent presence layer (`src/webmcp/presence/`); the UI-context bridge;
the normalized `CareersJob` model and the deterministic weighted scorer; the
20-job catalog; the candidate session; saved jobs; the shared application draft
store with monotonic revisions and stale-write rejection; the sign-up page,
draft store and account hand-off; the submission hand-off gate; handle-based
exports and the export view; the Vitest and Playwright suites; the docs; the
deployment.

**Evidence:** every commit in this repository is dated 2026-09-02, inside the
2026-08-25 → 2026-09-03 submission window. The first commit is the untouched
upstream import; everything after it is challenge work.

```bash
git log --oneline
git diff $(git rev-list --max-parents=0 HEAD)..HEAD --stat
```

Itemized split: `docs/CHALLENGE_DELTA.md` and `docs/UPSTREAM.md`.

---

## 9. Final submitted commit SHA

Fill in immediately before submitting, from the commit that is live on the
deployed URL:

```
FINAL SUBMITTED SHA: __________________________________________
```

Confirm the deployed site matches that SHA before pasting it into Devpost.
