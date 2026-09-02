# Audit Against docs/BUILD_CONTRACT.md

**Date:** 2026-09-02  
**Auditor:** Haiku 4.5  
**Status:** 1 BLOCKER, 0 MAJOR, 0 MINOR

---

## Blocker

**Severity:** BLOCKER  
**File:** `LICENSE`  
**Failed Contract:** §65 "keep upstream MIT license obligations"; §83 "open source license"  
**Description:** LICENSE file is Baalvion proprietary license, not MIT. UPSTREAM.md declares upstream as MIT-licensed, but the repository's LICENSE file contradicts this with proprietary restrictions.  
**Smallest Fix:** Replace LICENSE with MIT text. Add attribution to upstream in README (already present). Optionally add LICENSE.upstream for clarity.

---

## Verification Summary

### WebMCP API Correctness ✓
- `registerTool(tool, {signal})` correctly implemented in register.ts line 26
- All 11 required tools present in tools.ts
- Feature detection in WebMCPProvider.tsx (line 21) correctly checks `document.modelContext`
- Registration guards against double-registration in StrictMode

### Normal Site Without WebMCP ✓
- WebMCPProvider renders nothing and never throws (line 43)
- Feature detection gracefully exits if `document.modelContext` unavailable
- tests/e2e/no-webmcp.spec.ts confirms site works without shim
- AppProvider properly integrates WebMCPProvider

### No DOM Scraping ✓
- Zero instances of querySelector, innerText, getElementById, document.title in src/webmcp/

### Route/Session Handling ✓
- getContext() uses ui-context store + session store, never DOM
- Uses router state (pathname, searchParams, currentJobId, currentApplicationId)
- jobIdFromPathname fallback for route-derived context (line 28)

### Saved Jobs Shared ✓
- SaveJobButton.tsx and tools.ts both call setJobSaved from domain/saved-jobs
- Form subscribes to useSavedJobsStore (line 18) for instant agent-driven updates

### Application State Shared ✓
- Application form page uses useApplicationsStore (line 134)
- Both human UI and WebMCP call updateApplication, submitApplication from shared domain
- Form immediately syncs store changes to visible fields

### Stale Protection ✓
- assertFreshRevision guards mutations (application.store.ts line 142)
- Agent path passes expectedRevision; human path passes null (intentional)
- STALE_APPLICATION error returned with currentRevision/expectedRevision (§27)
- tests/e2e/application.spec.ts confirms stale rejection

### Auth Secret Leakage ✓
- getSessionSummary returns only {id, displayName}, no email/token/password
- tests/unit/webmcp/tools.test.ts line 269 explicitly checks no secrets in outputs
- Firebase config.ts is public web config, never exposed in tool results

### Annotations ✓
- careers_get_context: readOnlyHint: true
- careers_search_jobs: readOnlyHint: true, untrustedContentHint: true
- careers_get_job: readOnlyHint: true, untrustedContentHint: true
- careers_get_saved_jobs: readOnlyHint: true, untrustedContentHint: true
- careers_get_my_applications: readOnlyHint: true, untrustedContentHint: true
- careers_get_application: readOnlyHint: true, untrustedContentHint: true
- Mutations (open, set, start, update, submit) have no readOnlyHint ✓

### Output Bounding ✓
- LIMITS defined (results.ts line 9): searchDefault 10, searchMax 30, proseBytes 20KB, resultBytes 50KB
- boundResult() recursively truncates with explicit `truncated` flag

### Build/Test ✓
- `pnpm typecheck` passes
- `pnpm test:unit` passes: 113 tests, 10 files
- No compilation errors

### Docs/Provenance ✓
- BUILD_CONTRACT.md present and vendored
- UPSTREAM.md documents upstream repo, commit, date, MIT license claim
- CHALLENGE_DELTA.md clearly separates pre-existing vs. challenge work
- DECISIONS.md logs deviations (4 documented)

### All 11 Tools ✓
1. careers_get_context
2. careers_search_jobs
3. careers_get_job
4. careers_open_job
5. careers_get_saved_jobs
6. careers_set_saved_job
7. careers_get_my_applications
8. careers_get_application
9. careers_start_application
10. careers_update_application
11. careers_submit_application

---

## Recommendation

Fix the LICENSE file to be MIT-compliant before public submission. This is the only obstacle to accepting the build.

---

## Resolution (lead, 2026-09-02)

The LICENSE blocker was real and rooted in upstream: upstream HEAD (`aa50e85`)
had replaced its MIT declaration with a proprietary license on 2026-06-02.
Resolution: the repository history was rewritten so the import commit is
upstream `9108409` (the last MIT-declared commit, source-identical to HEAD
except a later layout breakage), an MIT LICENSE with dual attribution was
added, the visible brand was renamed to the fictional "Northwind", photos of
real people and the committed upstream API key were excluded, and the site was
redeployed. See docs/UPSTREAM.md and the final entry in docs/DECISIONS.md.
Typecheck, 113 unit tests and 10 Playwright tests pass after the change.
