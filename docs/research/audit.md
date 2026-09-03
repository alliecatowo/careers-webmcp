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

---

## Live in-app-browser acceptance pass (2026-09-02)

**Scope:** The deployed demo at `https://careers-webmcp.vercel.app`, exercised
through a WebMCP-capable in-app browser as the seeded candidate **Avery Chen**.
This supplements the code audit above with observed agent-visible and
human-visible behavior.

### Tool coverage

| Tool | Result | Evidence |
| --- | --- | --- |
| `careers_get_context` | Pass | Returned bounded sign-in state, candidate id/display name, page, and available destinations; no secrets. |
| `careers_search_jobs` | Pass | Broad, keyword, structured, skill, compensation, and result-bound searches returned expected jobs. |
| `careers_get_job` | Pass | Returned full Safety Systems Engineer detail. |
| `careers_open_job` | Pass | Opened the normal job-detail page. |
| `careers_open_page` | Pass | Opened Full-Time Roles, then browser history returned to the jobs search. |
| `careers_get_site_info` | Pass | Returned the structured hiring process. |
| `careers_set_search_view` | Pass, with visibility finding | Set the URL, query, department, employment type, level, and workplace; the normal jobs page displayed three matching cards. |
| `careers_get_saved_jobs` | Pass | Returned the newly saved Security Engineer. |
| `careers_set_saved_job` | Pass | Saved and then removed Security Engineer, proving both directions. |
| `careers_get_my_applications` | Pass | Returned submitted application `app_1`. |
| `careers_get_application` | Pass | Returned draft fields, revision, and `missingRequiredFields`. |
| `careers_start_application` | Pass | Created draft `app_1` and opened the normal application page. |
| `careers_update_application` | Pass | Updated availability, cover note, then phone, advancing revisions 1 → 3. |
| `careers_focus_application_field` | Pass | Focused the visible phone input. |
| `careers_submit_application` | Pass | Returned `VALIDATION_ERROR` for missing phone, then `awaiting_human_confirmation` once valid. |
| `careers_create_export` | Pass | Created `exp_1`, a five-row filtered jobs CSV. |
| `careers_read_export` | Pass | Returned the requested two-row, four-column slice and `hasMore: true`. |
| `careers_create_account` | Pass | With an explicitly provided full name, email, and phone, populated the normal sign-up form and returned `awaiting_human_confirmation`; it did not create an account. |

### Observed findings

1. **[Major UX] Search activity was not visible to the reviewer at first.**
   `careers_set_search_view` correctly changed the real search box and filters,
   but the browser was initially hidden. For a live demo, show the browser or
   make the presence-layer animation prominent enough that observers can watch
   the typed query and filter changes.

2. **[Major UX/state sync] The form displayed a stale validation error after a
   semantic update.** `careers_update_application` returned revision 3 with no
   missing required fields, while the normal form still showed “Please fill in
   all required fields.” `careers_submit_application` then correctly returned
   `awaiting_human_confirmation`; the page also showed the correct “Everything
   checks out” handoff. The stale error should be cleared when the shared draft
   store updates.

3. **[Minor UX] The normal Submit button completed asynchronously without an
   immediate visible transition.** The first click left the page appearing
   unchanged; shortly afterward the browser navigated to My Account, where the
   application was visibly submitted and `careers_get_my_applications` reported
   revision 4/status `submitted`. Add a clear pending/submitting state and
   success feedback at the point of click.

4. **[Pass] Semantic authentication disclosure is correctly bounded.** The
   context tool exposed only `signedIn`, candidate id, and display name, while
   the visible header independently showed Avery Chen. It did not expose
   cookies, tokens, passwords, or email.

5. **[External browser-safety constraint] Signup data must be explicit.** The
   browser automation safety layer rejected an initial account-preparation
   attempt because the agent had an email but inferred the name. That was not a
   Careers WebMCP or site validation failure: once the person supplied the
   exact name, email, and phone, `careers_create_account` populated the live
   form successfully and visibly returned the expected human-confirmation
   state. For demos, state all sign-up fields directly in the agent prompt.

6. **[Major demo UX] Agent attention cues do not reliably bring the affected
   element into view.** The activity layer and field highlights appeared, but
   the viewport did not consistently jump or smoothly scroll to the search
   input, changed filter, focused application field, or handoff Submit button.
   This makes the interaction feel invisible unless the observer already has
   the exact section on screen. Couple every presence highlight/focus action to
   a short, non-disruptive `scrollIntoView` (respecting reduced-motion) and a
   focused visual pulse on the actual control.

### Current result

All 18 registered tools passed live browser exercise. The test account signup
remained staged: the agent did not press the final **Create account** button.
