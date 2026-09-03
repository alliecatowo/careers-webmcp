# Architecture

The rule: the human UI and the WebMCP tools operate on the **same** state
through the **same** services. WebMCP never reads the DOM.

```
┌──────────────────────────────────────────────────────────────┐
│ Careers website (Next.js app router, runs in mock/demo mode) │
│                                                              │
│  Human UI                                                    │
│   job list / job page / Save button / application form       │
│   sign-up form / Export CSV button / export view             │
│        ↕ subscribe / call                                    │
│  Domain state (zustand, localStorage-persisted per candidate)│
│   session ── ui-context ── saved-jobs ── applications        │
│   signup draft ── exports (sessionStorage, tab-scoped)       │
│        ↕                                                     │
│  Existing services / mock adapter                            │
│   talentService.getJobs / getJobById / departments / countries│
│        ↑ call                                                │
│  WebMCP semantic adapter  (src/webmcp)                       │
│   tools.ts → context.ts / navigation.ts / results.ts / errors│
│        ↕ instrument() wraps execute                          │
│  Presence store (src/webmcp/presence) → AgentPresenceLayer   │
│        ↕                                                     │
│  document.modelContext.registerTool(...)                     │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
              WebMCP-capable browser agent
```

## Modules

| Path | Role |
| --- | --- |
| `src/domain/session/` | Canonical candidate session. Signed out by default. `signInAsDemoCandidate()` is what the header button, the login page and the application page call. Exposes `getSessionSummary()` (id + display name only). |
| `src/domain/ui-context/` | Router state published by the normal pages: `PageContextBridge` (pathname + query, mounted once), `CurrentJobBridge` (job detail page), `CurrentApplicationBridge` (application page). `classifyPathname()` maps routes to `jobs_index / job_detail / application / my_applications / profile / other`. |
| `src/domain/jobs/` | `normalizeJob` (upstream `Job` → `CareersJob`), `getJobCatalog` / `getCareersJob` (thin wrappers over `talentService`), `filterAndRankJobs` (deterministic scorer + hard filters), `searchJobs` (`filterAndRankJobs` + the tool-result page limit). |
| `src/domain/saved-jobs/` | Per-candidate saved job ids. `setJobSaved()` is called by both the Save button and `careers_set_saved_job`. |
| `src/domain/applications/` | Per-candidate application drafts with monotonic `revision`. `startApplication` (idempotent), `updateApplication(expectedRevision | null, patch)`, `submitApplication`, `validateApplicationFields`. Human form writes pass `null` (human wins); agent writes pass the revision they read. |
| `src/domain/session/signup.store.ts` | Sign-up **draft**, distinct from the session store. `careers_create_account` writes the draft; `completeSignUp()` is the only thing that creates a session and is called from exactly one place, the human-clicked Create account button on `/careers/signup`. |
| `src/domain/exports/` | Handle-based CSV exports. `rows.ts` flattens `CareersJob` / `ApplicationDraft` into stringified rows, `csv.ts` serializes, `export.store.ts` is the registry (sessionStorage, tab-scoped, 500 rows per export, 10 exports retained). Shared by the Export CSV button and `careers_create_export`. |
| `src/webmcp/` | Tool definitions, schemas, result/error envelopes, bounds, registration, provider. |
| `src/webmcp/presence/` | Transient visual echo of agent activity: `instrument.ts` (execute wrapper), `presence.store.ts` (the only state it writes), `AgentPresenceLayer.tsx` / `AgentSpotlight.tsx` / `useAgentHighlight.ts` (subscribers), `typing.ts` (search-box typing animation). |
| `tests/webmcp-shim.ts` | Test-only `document.modelContext` fake (Node + injectable browser script). Never shipped to production. |

## Request flow examples

**Human opens a job, agent asks for context.** The server-rendered job page
mounts `CurrentJobBridge`, which stores the job id. `careers_get_context`
reads the ui-context store, looks the job up through `getCareersJob`, and
returns `{ page: { kind: 'job_detail' }, currentJob: { id, title } }`.

**Agent opens a job.** `careers_open_job` validates the id through the
catalog, then calls the Next router (installed into `navigation.ts` by
`WebMCPProvider`). The real job page renders; the human sees it.

**Human and agent co-edit an application.** Both write to
`useApplicationsStore` through `updateApplication`. The form binds
react-hook-form `values` to the store draft, so agent writes appear in the
inputs. Human keystrokes call `updateApplication(..., null, patch)` and bump
`revision`. An agent write with an older `expectedRevision` is rejected with
`STALE_APPLICATION { expectedRevision, currentRevision }` and the human text
survives.

## Agent presence

Presence is a decoration layer, not a code path. `register.ts` calls
`instrumentAll(tools)` once, so what is registered on `document.modelContext`
is each tool wrapped by `instrument()`:

```
registerTool ── instrument(tool).execute ──┐
                     │                     │
                     │ beginActivity       ├─→ tool.execute(input)  ← unchanged result
                     │ endActivity         │
                     ▼                     │
              presence.store ──────────────┘
                     ↕ subscribe
   AgentPresenceLayer / AgentSpotlight / useAgentHighlight / search input
```

Three properties make this safe to have in the tool path:

- The wrapper **never alters the return value**. It awaits `tool.execute`,
  reports a phase, and returns exactly what the tool returned (errors are
  re-thrown after `endActivity`).
- It **swallows its own errors**. Every `beginActivity` / `endActivity` call is
  in a `try/catch` that ignores failures, so a presence bug cannot break a tool
  call.
- It **renders no DOM until a tool actually runs**. `AgentPresenceLayer`
  returns `null` while `agentPresent` is false, and only `beginActivity` — which
  only the wrapper calls — can flip it. Registration alone produces nothing.

Labels and captions are authored strings and counts (`"Searching jobs"`,
`"6 matches"`); untrusted job/application text is never interpolated into them.

**Direction of control.** Presence pushes; it never queries the DOM.

- `careers_focus_application_field` calls `requestFocus(field)`, which publishes
  a focus *request* to the presence store. The application form component owns
  the input ref and subscribes to `focusRequest`; it performs the focus and
  flash itself. The tool does no `getElementById`, and works the same whether or
  not the form is mounted at call time.
- `careers_set_search_view` drives `typeIntoSearch`, which advances a `typing`
  slice of the store character by character and then commits the query to the
  URL. The visible search input is a pure subscriber to that slice. The timer
  lives in `typing.ts` rather than the input so the animation survives the input
  not being mounted yet (the agent usually navigates in the same call), and the
  commit happens synchronously outside a browser or after abort — tool results
  never depend on animation timing.

## Exports

An MCP tool result is a plain value; there is no file handle in the protocol,
and a full result set does not fit inside the output bounds. So an export is
created once as a real artifact and the agent is handed a reference to it:

```
careers_create_export ─→ filterAndRankJobs ─→ jobsToRows ─→ createExport()
                                                              │
   { exportId, rowCount, columns, preview, downloadUrl } ←─────┤ registry
                                                              │ (sessionStorage)
careers_read_export(exportId, offset, limit≤100, columns) ←────┘
                                                              │
   Export CSV button / /careers/exports/[id] ←─────────────────┘
```

- Rows **never enter a tool result**. `careers_create_export` returns a handle,
  the column list and a three-row preview; the agent pulls bounded windows with
  column projection through `careers_read_export`.
- The registry is persisted to `sessionStorage`, so the human can follow the
  agent's `downloadUrl` on a fresh render, but it is tab-scoped and gone when
  the tab closes. 500 rows retained per export, 10 exports retained.
- The `jobs` dataset ranks with `filterAndRankJobs`, not `searchJobs`, because
  export rows are not subject to the tool-result output bound that `searchJobs`
  applies. The export's own 500-row cap is what bounds it.
- The same CSV is reachable by the human from the Export CSV button on the jobs
  page, so this is not an agent-only capability.

## Agent-prepared sign-up

`src/domain/session/signup.store.ts` is a **draft** store, deliberately separate
from `src/domain/session/session.store.ts`:

```
careers_create_account ─→ signup draft store ─→ /careers/signup form (bound to draft)
                                                        │ human clicks Create account
                                                        ▼
                                                  completeSignUp() ─→ session store
```

The agent can only write the draft, and gets back
`status: 'awaiting_human_confirmation'` with `missingRequiredFields` /
`invalidFields`. `completeSignUp()` is what creates a session, and it is called
from exactly one place: the Create account button on the sign-up page. There is
no `confirm: true` parameter and no second path. The agent learns the account
exists the same way it learns anything else — `careers_get_context` starts
reporting `session.signedIn: true`.

## The one-scorer invariant

`filterAndRankJobs` (extracted from `searchJobs` in `src/domain/jobs/search.ts`)
is now the single matcher for both audiences:

```
GlobalJobListing ──┐
                   ├─→ filterAndRankJobs(catalog, query)
careers_search_jobs ┤        ▲
careers_set_search_view ┘    └── searchJobs adds only the tool-result page limit
```

Previously the visible listing passed a literal substring `q` to the service
adapter while the tools used the weighted scorer, so the page and the agent
could disagree about what matched — "Research Engineer Inference" returned one
job to the agent and zero on screen. They now cannot disagree: the count
`careers_set_search_view` reports is computed by the same function that produces
the rows the human is looking at.

## Registration lifecycle

`WebMCPProvider` runs once in the root provider tree. It feature-detects
`document.modelContext`; if present it registers all 16 tools with an
`AbortSignal` and aborts on unmount. Tools are **not** re-registered on route
changes, sign-in, or state changes: they read live state at invocation time.
If WebMCP is absent nothing happens and the site is an ordinary careers portal.

## Bounds and safety

- Search results: default 10, max 30 (`SEARCH_LIMIT_EXCEEDED` above that)
- Prose fields capped at ~20 KB, whole results at ~50 KB, with `truncated: true`
- Exports: 500 rows retained per export, 100 rows per `careers_read_export` call; rows travel only as handles, previews and requested slices
- Tool descriptions are static strings authored here; job/user text only ever appears in results, which carry `untrustedContentHint: true`
- Results never include emails (beyond the candidate's own application fields), tokens, cookies or storage dumps; a regression test asserts it
- Candidate-scoped tools return `AUTH_REQUIRED` when signed out; there is no agent-only session path
