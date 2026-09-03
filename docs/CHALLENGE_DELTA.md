# Challenge delta: what was pre-existing vs. built for the WebMCP Challenge

This submission extends an existing open-source careers portal. The careers
application itself is **not** the contribution. The WebMCP layer and the
shared-state plumbing that makes it honest are. Verify the delta yourself:

```bash
git log --oneline            # first commit = untouched upstream snapshot
git diff <first-commit>..HEAD --stat
```

## Pre-existing upstream functionality (Baalvion Jobs Portal, MIT)

- Next.js 14 app-router project, TypeScript, Tailwind, shadcn/Radix UI kit
- Public careers site: landing pages, job listing with search/country/department/type filters, pagination, job detail pages with SEO structured data
- Country-scoped careers routes and compliance sections
- Candidate account area (`/my-account`) layout, protected-route guard, user menu
- Multi-phase application wizard (replaced, see DECISIONS.md), zod validation rules for the shared fields
- Admin/recruiter dashboards, interviews, offers, analytics, campus placement, Genkit AI flows (all untouched and **not** part of the challenge surface)
- Service/adapter architecture (`talentService` → mock adapter or server adapter) and mock data files
- Zustand auth store, mock login page for admin roles
- Visual design system retained (brand strings renamed to the fictional "Northwind")

Import notes: the import is upstream commit `9108409` (last MIT-declared
state, see docs/UPSTREAM.md); photos of real people were excluded; the visible
brand was renamed to the fictional "Northwind" (string replacement only).

## Challenge-period work (this repository's commits after the import)

WebMCP layer (`src/webmcp/`)
- Tool registration via `document.modelContext.registerTool`, feature-detected, registered once per page load, unregistered via AbortSignal
- 16 candidate-facing tools: `careers_get_context`, `careers_search_jobs`, `careers_get_job`, `careers_open_job`, `careers_set_search_view`, `careers_get_saved_jobs`, `careers_set_saved_job`, `careers_get_my_applications`, `careers_get_application`, `careers_start_application`, `careers_update_application`, `careers_focus_application_field`, `careers_submit_application`, `careers_create_account`, `careers_create_export`, `careers_read_export`
- JSON Schema inputs, structured error model, `readOnlyHint` / `untrustedContentHint` annotations, central output bounds with explicit `truncated`
- Router bridge so tools navigate the real site (`careers_open_job`, `careers_start_application`)
- Human-confirmation hand-off: `careers_create_account` and `careers_submit_application` stage the real form and return `awaiting_human_confirmation`; neither can complete without a human click

Agent presence (`src/webmcp/presence/`)
- Transient visual echo of agent activity: scan bar, one activity pill at a time, per-field flashes, job-title spotlight, hand-off cue
- Character-by-character typing into the site's own search box (`careers_set_search_view`)
- Field focus driven by the form component that owns the ref, not by DOM lookup from a tool (`careers_focus_application_field`)
- Renders no DOM at all until a tool is actually invoked; the wrapper never alters a tool result and swallows its own errors

Candidate sign-up (`src/domain/session/signup.store.ts`, `/careers/signup`)
- Normal human sign-up page and draft store; the agent fills the draft, the human confirms

Exports (`src/domain/exports/`, `/careers/exports/[id]`, Export CSV button)
- Handle-based export model: the agent gets `{ exportId, rowCount, columns, preview }` and reads slices with column projection, so a full result set never enters a tool result
- Same CSV downloadable by the human from the jobs page and the export view

Live context (`src/domain/ui-context/`)
- Router-state bridge: page kind, path, current job, current application, current search filters, published by the normal pages (no DOM scraping)

Semantic job catalog and search (`src/domain/jobs/`)
- Normalized `CareersJob` model over the upstream `Job` type (level, team, workplace, location, compensation, skills, summary)
- Deterministic weighted search with hard filters (no embeddings, no LLM)
- Deterministic 20-job demo catalog spanning $165k-$575k; listing/detail UI now shows level, workplace, compensation, team, skills
- `filterAndRankJobs` shared by the visible jobs listing and the search tools, so the page and the agent never disagree about what matches

Candidate session (`src/domain/session/`)
- Signed-out by default, "Continue as Avery Chen" demo session, persisted locally, no secrets; mirrored into upstream's auth store

Saved jobs (`src/domain/saved-jobs/`, `SaveJobButton`)
- New small candidate feature shared by the human Save button and `careers_set_saved_job`

Applications (`src/domain/applications/`, single-page application form, my-account tabs)
- Shared draft store with monotonic `revision`, optimistic-concurrency rejection (`STALE_APPLICATION`), same validation for human and agent, idempotent start, submission gate

Tests
- Vitest unit tests (search, normalization, context, registration, errors, bounds, saved jobs, application revisions, secret-leak regression)
- Playwright browser tests with a test-only `document.modelContext` shim (no-WebMCP, registration, shared route, shared save, application co-edit, stale protection, human-confirmed submission, auth-required, agent presence, agent-prepared sign-up, exports)

Docs and demo
- README, architecture, tool reference, demo script, submission notes, decisions log, upstream attribution
- Deployment configuration for a public HTTPS demo

## Not built (deliberately)

No LLM/AI SDK, no MCP server, no chat panel, no recommendation model, no
resume parsing or upload through WebMCP, no admin/recruiter tools, no external
ATS integrations. See BUILD_CONTRACT §7 and §72.
