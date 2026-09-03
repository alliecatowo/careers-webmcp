# Decisions (deviations from docs/BUILD_CONTRACT.md only)

Format: Decision / Why BUILD_CONTRACT could not be followed / Evidence / Replacement.

---

Decision: Keep upstream job URLs (`/careers/countries/united-states/jobs/<jobId>`) instead of the contract's illustrative `/jobs/<slug>`.
Why BUILD_CONTRACT could not be followed: §12/§22 require reusing the existing job detail page and router; upstream's canonical route is country-scoped and its listing, sitemap, metadata and legacy `/job/[id]` redirect all target it.
Evidence: `src/app/(public)/careers/countries/[slug]/jobs/[jobId]/page.tsx`, `src/app/(public)/job/[id]`.
Replacement: `CareersJob.url` carries the canonical upstream URL; tools return it and `careers_open_job` navigates to it.

---

Decision: Replace upstream's three-phase application wizard with a single-page application form backed by a shared draft store.
Why BUILD_CONTRACT could not be followed: §26 forbids file uploads and sensitive hiring data in the WebMCP v1 model, and §47 requires the human form and the agent to share one canonical draft. Upstream's wizard requires a resume file (zod `resume` refine), collects national ID / tax ID / photo ID in phase 3, and keeps form state in-memory per phase with no revision.
Evidence: `src/types/application.types.ts` (`multiPhaseApplicationSchema`), upstream `src/store/application.store.ts` (in-memory only), phase2/phase3 routes.
Replacement: `src/domain/applications` (zustand + localStorage, per candidate, monotonic `revision`) with semantic fields fullName, email, phone, location, linkedinUrl, portfolioUrl, yearsExperience, coverNote, availability. Upstream per-field zod rules were reused for the shared fields. Phase 2/3 routes were removed; the success route was kept.

---

Decision: Application submission is finalized in the shared mock-side store rather than by POSTing to upstream's `/api/[country]/application` route.
Why BUILD_CONTRACT could not be followed: §8 requires a deterministic demo with no backend; upstream's API route expects multipart resume uploads and is designed for a Firebase-backed pipeline that is out of scope (§7, §72).
Evidence: `src/app/api/[country]/application/route.ts`, `src/services/application.service.ts`.
Replacement: `submitApplication()` in `src/domain/applications` performs the same validation gate the human form uses, sets `status: 'submitted'`, and both the human Submit button and `careers_submit_application` call it.

---

Decision: The site starts signed out and offers "Continue as Avery Chen" instead of upstream's auto-signed-in mock admin.
Why BUILD_CONTRACT could not be followed: §34/§62 require a real candidate session that the human establishes and that signed-out mutations return `AUTH_REQUIRED`; upstream's `AuthProvider` silently signed every visitor in as `SUPER_ADMIN`.
Evidence: upstream `src/app/providers/AuthProvider.tsx`.
Replacement: `src/domain/session/session.store.ts` (localStorage-persisted demo candidate session, no secrets) mirrored into upstream's auth store so upstream guards keep working. Upstream's mock admin login form is left intact but is not part of the challenge surface.

---

Decision: Upstream's root layout was repaired.
Why BUILD_CONTRACT could not be followed: §8 requires the untouched upstream to run; the upstream commit imported renders `<p>Pay to your Employee</p>` in `<body>` and never renders `{children}`.
Evidence: upstream `src/app/layout.tsx` @ aa50e85.
Replacement: restored `<AppProvider>{children}</AppProvider>` (one-line fix, recorded as pre-existing breakage in CHALLENGE_DELTA).

---

Decision: Base the import on upstream commit `9108409` (2026-04-14) instead of upstream HEAD `aa50e85`, add an MIT LICENSE file with dual attribution, and rename the visible employer brand to the fictional "Northwind".
Why BUILD_CONTRACT could not be followed: §3 says to use the upstream state at the time implementation begins and calls the upstream MIT-licensed, but upstream HEAD carries a proprietary LICENSE (added 2026-06-02 in `a14cffd`) that forbids modification, hosting and redistribution; §65/§83 require an open-source license and a public deployment. `9108409` is the last commit published under the README's "MIT License / Copyright (c) Baalvion" declaration, and its application source is identical to HEAD apart from a later one-line layout breakage.
Evidence: `git log -- LICENSE` in upstream (`a14cffd chore: add proprietary license`); `git diff --name-status 9108409 aa50e85` lists only LICENSE, README.md, .github/preview.png, public/photos/* and src/app/layout.tsx. Final audit (docs/research/audit.md) flagged the LICENSE as the single blocker.
Replacement: import snapshot of `9108409` (excluding photos of real people), MIT LICENSE naming both copyright holders, provenance in docs/UPSTREAM.md, and "Baalvion"/"TalentOS" replaced by "Northwind"/"Northwind Careers" in UI strings and demo data so the demo does not use upstream's trademark. The earlier "root layout repaired" decision is moot because `9108409` predates the breakage; it is kept above for the record.

---

Decision: Add a transient agent-presence layer (`src/webmcp/presence`) that renders a visible echo of agent activity: a scan bar, one activity pill at a time, a typed-in search query, and flashes on the fields the agent wrote.
Why BUILD_CONTRACT could not be followed: §72 lists "agent activity sidebar" among things not to build, and §15 forbids "sparkle buttons" and "Ask AI". But the contract's own completion criteria require that "agent navigation visibly affects the normal site", and §47 calls shared visible state "important for the visual demo". The prohibitions in §15/§72 are about the site *summoning* or *advertising* an agent; this layer can do neither.
Evidence: `src/webmcp/presence/AgentPresenceLayer.tsx` returns `null` until `agentPresent` flips, which only `beginActivity` (called from the tool wrapper) can do. `tests/e2e/presence.spec.ts` asserts that with the shim installed and all 18 tools registered, no presence DOM exists until a tool is actually invoked. There is no chat panel, no prompt box, no way to start an agent, and nothing persists.
Replacement: presence is decoration wrapped around `execute` by `src/webmcp/presence/instrument.ts`, which never alters a tool's return value and swallows its own errors (`tests/unit/webmcp/presence.test.ts`). All labels and captions are authored by us from counts and enums only — never interpolated from job or application text (§36).

---

Decision: `careers_submit_application` validates and hands the application back to the human instead of submitting it.
Why BUILD_CONTRACT could not be followed: §32 describes the tool setting `status: 'submitted'`. It also says, in the same section, "The demo does NOT have to use automated submission. The best demo may deliberately have the human inspect and submit manually."
Evidence: `src/webmcp/tools.ts` (`careers_submit_application`), `tests/e2e/application.spec.ts`.
Replacement: the tool runs the same `validateApplicationFields` gate the human Submit button runs, enforces `expectedRevision`, opens the application page, highlights the real Submit button, and returns `status: 'awaiting_human_confirmation'` — or `VALIDATION_ERROR` naming the missing fields. Only the human click calls `submitApplication()`. The site capability is still exposed; the irreversible step stays with the person.

---

Decision: Add `careers_create_account`, a tool that fills the site's normal sign-up form and hands off for human confirmation.
Why BUILD_CONTRACT could not be followed: §16's v1 tool surface does not include account creation, and §25 says "Do not silently create session."
Evidence: `src/domain/session/signup.store.ts`, `src/app/(public)/careers/signup/page.tsx`, `tests/e2e/account.spec.ts`.
Replacement: the tool writes only to a sign-up *draft*; `completeSignUp()` is called exclusively by the human-clicked Create account button, so no session is ever created silently. The sign-up page is an ordinary page that works with no agent present. This extends the contract's thesis rather than contradicting it: account creation is exactly the kind of friction a visiting user should not have to grind through by hand, and it is a capability the site already has.

---

Decision: Add `careers_create_export` / `careers_read_export`, which return a handle to a downloadable CSV rather than rows.
Why BUILD_CONTRACT could not be followed: §16 does not list export tools. §37 requires bounded output and an explicit `truncated` flag, which makes "give me the whole result set" awkward to express in a tool result.
Evidence: `src/domain/exports/`, `src/app/(public)/careers/exports/[id]/page.tsx`, `tests/unit/exports/exports.test.ts`.
Replacement: an export is created once as a real artifact the human can download from the page, and the agent receives `{ exportId, rowCount, columns, preview, downloadUrl }` — never the rows. It then pulls windows and column projections through `careers_read_export` (max 100 rows per call). This *strengthens* §37: an agent can work over a full result set without any single tool result exceeding the output bound. Per §42 the same CSV is reachable by a human via the Export CSV button on the jobs page, so this is not an agent-only capability.

---

Decision: Add `careers_set_search_view` and `careers_focus_application_field`.
Why BUILD_CONTRACT could not be followed: no deviation. §74 names both as optional post-core tools and §49 specifies the focus tool's shape.
Evidence: `src/webmcp/tools.ts`, `tests/e2e/presence.spec.ts`.
Replacement: n/a — recorded here only because they extend the §16 v1 tool list from 11 names to 16.

---

Decision: The human jobs listing now resolves its free-text query, level and workplace filters through `filterAndRankJobs`, the same scorer `careers_search_jobs` uses, instead of passing `q` to the service adapter.
Why BUILD_CONTRACT could not be followed: no deviation — §11 requires the normal UI and WebMCP to operate on the same state and services. They were not.
Evidence: the adapter's `q` filter is a literal substring match, so "Research Engineer Inference" matched zero jobs in the visible list while `careers_search_jobs` returned one ("Research Engineer, Inference"). The agent and the page disagreed on screen.
Replacement: `filterAndRankJobs` extracted from `searchJobs` in `src/domain/jobs/search.ts`; `GlobalJobListing` and both search tools now share it. `searchJobs` layers only the tool-result page limit on top.

---

Decision: Seed 20 demo jobs rather than the 12-18 in §41.
Why BUILD_CONTRACT could not be followed: §41 caps the catalog at 18.
Evidence: `src/mocks/talent-platform/jobs.mock.ts`.
Replacement: the 15 roles §41 specifies, plus five frontier-lab roles (Research Engineer Inference; Member of Technical Staff, Post-Training; Safety Systems Engineer; Training Cluster Engineer; Agent Platform Engineer). These widen the compensation spread from $165k-$340k to $165k-$575k, which makes a "staff level or above, at least $220k" query discriminate between bands instead of returning nearly everything.
