# Architecture

The rule: the human UI and the WebMCP tools operate on the **same** state
through the **same** services. WebMCP never reads the DOM.

```
┌──────────────────────────────────────────────────────────────┐
│ Careers website (Next.js app router, runs in mock/demo mode) │
│                                                              │
│  Human UI                                                    │
│   job list / job page / Save button / application form       │
│        ↕ subscribe / call                                    │
│  Domain state (zustand, localStorage-persisted per candidate)│
│   session ── ui-context ── saved-jobs ── applications        │
│        ↕                                                     │
│  Existing services / mock adapter                            │
│   talentService.getJobs / getJobById / departments / countries│
│        ↑ call                                                │
│  WebMCP semantic adapter  (src/webmcp)                       │
│   tools.ts → context.ts / navigation.ts / results.ts / errors│
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
| `src/domain/jobs/` | `normalizeJob` (upstream `Job` → `CareersJob`), `getJobCatalog` / `getCareersJob` (thin wrappers over `talentService`), `searchJobs` (deterministic scorer + hard filters). |
| `src/domain/saved-jobs/` | Per-candidate saved job ids. `setJobSaved()` is called by both the Save button and `careers_set_saved_job`. |
| `src/domain/applications/` | Per-candidate application drafts with monotonic `revision`. `startApplication` (idempotent), `updateApplication(expectedRevision | null, patch)`, `submitApplication`, `validateApplicationFields`. Human form writes pass `null` (human wins); agent writes pass the revision they read. |
| `src/webmcp/` | Tool definitions, schemas, result/error envelopes, bounds, registration, provider. |
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

## Registration lifecycle

`WebMCPProvider` runs once in the root provider tree. It feature-detects
`document.modelContext`; if present it registers all 11 tools with an
`AbortSignal` and aborts on unmount. Tools are **not** re-registered on route
changes, sign-in, or state changes: they read live state at invocation time.
If WebMCP is absent nothing happens and the site is an ordinary careers portal.

## Bounds and safety

- Search results: default 10, max 30 (`SEARCH_LIMIT_EXCEEDED` above that)
- Prose fields capped at ~20 KB, whole results at ~50 KB, with `truncated: true`
- Tool descriptions are static strings authored here; job/user text only ever appears in results, which carry `untrustedContentHint: true`
- Results never include emails (beyond the candidate's own application fields), tokens, cookies or storage dumps; a regression test asserts it
- Candidate-scoped tools return `AUTH_REQUIRED` when signed out; there is no agent-only session path
