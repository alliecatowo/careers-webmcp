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
