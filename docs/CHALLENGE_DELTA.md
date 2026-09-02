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
- 11 candidate-facing tools: `careers_get_context`, `careers_search_jobs`, `careers_get_job`, `careers_open_job`, `careers_get_saved_jobs`, `careers_set_saved_job`, `careers_get_my_applications`, `careers_get_application`, `careers_start_application`, `careers_update_application`, `careers_submit_application`
- JSON Schema inputs, structured error model, `readOnlyHint` / `untrustedContentHint` annotations, central output bounds with explicit `truncated`
- Router bridge so tools navigate the real site (`careers_open_job`, `careers_start_application`)

Live context (`src/domain/ui-context/`)
- Router-state bridge: page kind, path, current job, current application, current search filters, published by the normal pages (no DOM scraping)

Semantic job catalog and search (`src/domain/jobs/`)
- Normalized `CareersJob` model over the upstream `Job` type (level, team, workplace, location, compensation, skills, summary)
- Deterministic weighted search with hard filters (no embeddings, no LLM)
- Deterministic 15-job demo catalog; listing/detail UI now shows level, workplace, compensation, team, skills

Candidate session (`src/domain/session/`)
- Signed-out by default, "Continue as Avery Chen" demo session, persisted locally, no secrets; mirrored into upstream's auth store

Saved jobs (`src/domain/saved-jobs/`, `SaveJobButton`)
- New small candidate feature shared by the human Save button and `careers_set_saved_job`

Applications (`src/domain/applications/`, single-page application form, my-account tabs)
- Shared draft store with monotonic `revision`, optimistic-concurrency rejection (`STALE_APPLICATION`), same validation for human and agent, idempotent start, submission gate

Tests
- Vitest unit tests (search, normalization, context, registration, errors, bounds, saved jobs, application revisions, secret-leak regression)
- Playwright browser tests with a test-only `document.modelContext` shim (no-WebMCP, registration, shared route, shared save, application co-edit, stale protection, submission, auth-required)

Docs and demo
- README, architecture, tool reference, demo script, submission notes, decisions log, upstream attribution
- Deployment configuration for a public HTTPS demo

## Not built (deliberately)

No LLM/AI SDK, no MCP server, no chat panel, no recommendation model, no
resume parsing or upload through WebMCP, no admin/recruiter tools, no external
ATS integrations. See BUILD_CONTRACT §7 and §72.
