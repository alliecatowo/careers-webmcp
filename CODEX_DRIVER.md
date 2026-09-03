# CODEX_DRIVER.md — external verification protocol for Careers WebMCP

You are an **external agent (Codex) with a WebMCP-capable browser**. Verify
this site **from the flows, not the code**. You do not need to read the
repository. Everything you need is on the live site plus the tool surface the
page hands you via `document.modelContext`.

## 1. Setup

- **Live URL:** `https://careers-webmcp.vercel.app/careers/open-positions`
- **What this is:** a fictional employer ("Northwind") careers site. It works
  fully with no agent present — you are the bonus, not the backend.
- **Catalog scope:** 20 open roles, one employer, compensation $165k–$575k.
  Departments include Engineering, Design, Product, Data, Sales, Marketing,
  Operations. Levels include Intern through Principal plus Staff / Senior
  Staff. Locations include San Francisco, New York, Austin, Remote, and others.
- **Demo session:** click **Continue as Avery Chen** (header). That is the
  site's normal candidate sign-in — no password, no token. Sign-out is in the
  same header menu.
- **Clean slate:** before each full run, clear site data (localStorage +
  sessionStorage) for the origin, then reload. The site must open signed out
  with zero presence UI (no pills, no scan bar, no typing) until the first
  tool runs.
- **How to call tools:** use the WebMCP tools the page registers (names below,
  `careers_*`). If your harness exposes raw calls, call with the exact JSON
  inputs given. Otherwise, the natural-language prompts in §4 drive the same
  tools — confirm from the pills which tool actually ran.

**Ground rules for a PASS:**

- Every tool result is a JSON payload; failures carry `isError: true` and a
  short `error` code (e.g. `AUTH_REQUIRED`) — never a stack trace or secret.
- Every tool invocation shows a presence pill naming the action (labels in
  §3). A tool that runs with no visible trace is a FAIL (report it).
- Reads never change data: re-reading after a read must return identical
  revisions, counts, and lists.
- The agent and the human share one state: anything the agent writes must be
  visible in the normal UI (form inputs, Save button state, filters,
  download), and anything the human clicks/types must be visible to the next
  tool call.

## 2. Tool inventory (16 tools)

| # | Tool | Kind | Needs sign-in |
| --- | --- | --- | --- |
| 1 | `careers_get_context` | read | no |
| 2 | `careers_search_jobs` | read | no |
| 3 | `careers_get_job` | read | no |
| 4 | `careers_open_job` | navigate | no |
| 5 | `careers_get_saved_jobs` | read | **yes** |
| 6 | `careers_set_saved_job` | mutate | **yes** |
| 7 | `careers_get_my_applications` | read | **yes** |
| 8 | `careers_get_application` | read | **yes** |
| 9 | `careers_start_application` | mutate | **yes** |
| 10 | `careers_update_application` | mutate | **yes** |
| 11 | `careers_submit_application` | hand-off (never submits) | **yes** |
| 12 | `careers_set_search_view` | navigate | no |
| 13 | `careers_focus_application_field` | navigate+focus | **yes** |
| 14 | `careers_create_account` | hand-off (never creates) | no (no-op if signed in) |
| 15 | `careers_create_export` | mutate (creates handle) | only for `applications` dataset |
| 16 | `careers_read_export` | read | only for another session's applications export |

## 3. Per-tool checklists

For each: make the **exact call**, check the **expected result**, and check
the **expected visible UI/state change**. Presence pill labels are quoted.

### 3.1 `careers_get_context` — read

- **Call:** `{}` on `/careers/open-positions` while signed out.
- **Expected result:** `session.signedIn: false`; `page.kind: "jobs_index"`;
  `page.path` contains `/careers/open-positions`; `currentJob: null`.
- **Visible:** pill *Reading page context*. Nothing else on the page changes.
- **Then:** open a job page, call again → `page.kind: "job_detail"`,
  `currentJob: { id, title }` naming the job on screen.

### 3.2 `careers_search_jobs` — read

- **Call:** `{"departments": ["Engineering"], "levels": ["Staff", "Senior Staff", "Principal"], "locations": ["San Francisco", "Remote"], "minCompensation": 220000}`.
- **Expected result:** `totalMatches` is 6; `jobs` is a bounded array (≤ 10
  by default); each entry has `id`, `title`, `compensation`, `url`.
  `truncated: false`.
- **Visible:** pill *Searching jobs · 6 matches*. The page list does NOT
  change (this tool only reads — to show results, see §3.12).
- **Bounds:** call with `{"maxResults": 31}` → error
  `SEARCH_LIMIT_EXCEEDED`.

### 3.3 `careers_get_job` — read

- **Call:** `{"jobId": "job_staff_platform"}`.
- **Expected result:** full detail: `title: "Staff Platform Engineer"`,
  `department`, `level`, `compensation`, `skills`, `summary`,
  `application: { alreadyApplied, saved }`.
- **Visible:** pill *Reading a job posting*. Page does not navigate.
- **Fallback:** call `{}` while on that job's detail page → returns the same
  job (context fallback). Call `{"jobId": "job_nope"}` → `JOB_NOT_FOUND`.

### 3.4 `careers_open_job` — navigate

- **Call:** `{"jobId": "job_staff_platform"}`.
- **Expected result:** `{ opened: true, job: { id, title, url } }`.
- **Visible:** pill *Opening a job · opened*; the **tab navigates to the real
  job page**; the job title flashes. The human can read the same page.
- **Error:** `{"jobId": "job_nope"}` → `JOB_NOT_FOUND`, no navigation.

### 3.5 `careers_get_saved_jobs` — read (signed in)

- **Setup:** sign in as Avery Chen first.
- **Call:** `{}`.
- **Expected result:** `{ savedJobs: [...] }` (possibly empty).
- **Visible:** pill *Checking saved jobs · N saved jobs*. Page unchanged.

### 3.6 `careers_set_saved_job` — mutate (signed in)

- **Call:** `{"jobId": "job_staff_platform", "saved": true}`.
- **Expected result:** `{ jobId: "job_staff_platform", "saved": true }`.
- **Visible:** pill *Updating saved jobs · saved*; the job page's **Save
  button flips to Saved**. Re-call `careers_get_saved_jobs` → the job is
  listed. Call with `"saved": false` → button flips back, pill says
  *removed*. This is the same operation as the button — not a shadow copy.

### 3.7 `careers_get_my_applications` — read (signed in)

- **Call:** `{}` (before any application → `{ applications: [] }`).
- **Expected result:** array entries with `id`, `jobId`, `jobTitle`,
  `status` (`draft`/`submitted`), `revision`, `url`.
- **Visible:** pill *Checking your applications · N applications*.

### 3.8 `careers_get_application` — read (signed in)

- **Setup:** an application exists (see §3.9).
- **Call:** `{"jobId": "job_staff_platform"}` (or `applicationId`).
- **Expected result:** `fields` object, `revision` number,
  `missingRequiredFields` array, `url`.
- **Visible:** pill *Reading your application*. Draft unchanged — call twice,
  `revision` must be identical.

### 3.9 `careers_start_application` — mutate (signed in)

- **Call:** `{"jobId": "job_staff_platform"}`.
- **Expected result:** `{ id, jobId, status: "draft", revision, url,
  created: true }` (repeat call → same `id`, `created: false` — idempotent).
- **Visible:** pill *Starting an application · draft created*; the **tab
  navigates to the real application form**, prefilled from the profile.

### 3.10 `careers_update_application` — mutate with revision (signed in)

- **Setup:** read the draft first (note `revision` = R).
- **Call:** `{"applicationId": "<id>", "expectedRevision": R, "fields": {"phone": "+1 555 0100"}}`.
- **Expected result:** new `revision` R+1, echoed `fields`,
  `updatedFields: ["phone"]`, `missingRequiredFields` shrunk.
- **Visible:** pill *Filling in your application · 1 field filled*; the
  phone input on the open form **flashes and shows the value**.
- **Stale write:** repeat with the OLD `expectedRevision` R → error
  `STALE_APPLICATION` with `{ expectedRevision, currentRevision }`; the
  draft keeps the new value (human/agent text survives).

### 3.11 `careers_submit_application` — HAND-OFF, never submits (signed in)

- **Setup:** fill all required fields first (via §3.10 + human typing).
- **Call:** `{"applicationId": "<id>", "expectedRevision": <current>}`.
- **Expected result:** `{ status: "awaiting_human_confirmation",
  applicationStatus: "draft", ... }` — the draft is STILL `draft`.
- **Visible:** pill *Preparing your application — waiting for you · waiting
  for you*; the page navigates to the form and the real **Submit button is
  highlighted**; a dismissible hand-off pill says the application is ready
  and it is your move.
- **Missing fields:** with an incomplete draft → `VALIDATION_ERROR` naming
  `missingRequiredFields`. No navigation to a dead end.
- **HARD RULE:** there is no input that makes this tool submit. If the
  application ever becomes `submitted` without a human click, that is a
  FAIL.

### 3.12 `careers_set_search_view` — navigate (no sign-in needed)

- **Call:** `{"query": "inference", "department": "Engineering"}`.
- **Expected result:** `{ applied: true, url, view: { query, department,
  ... }, totalMatches }`.
- **Visible:** the tab opens `/careers/open-positions?...`; the site's own
  search box **types "inference" character by character**; the visible list
  narrows; `totalMatches` equals the count on screen.
- **Error:** `{"department": "Nope"}` → `VALIDATION_ERROR` with a `known`
  array of valid names.

### 3.13 `careers_focus_application_field` — navigate+focus (signed in)

- **Call:** `{"field": "availability"}` (with an application open/in context).
- **Expected result:** `{ focused: true, applicationId, field:
  "availability", currentValue, url }`.
- **Visible:** the application page opens; the cursor lands in the
  availability field; the field highlights. Unknown field →
  `VALIDATION_ERROR`.

### 3.14 `careers_create_account` — HAND-OFF, never creates (signed out)

- **Setup:** signed OUT (this is the point).
- **Call:** `{"fullName": "Sam Rivera", "email": "sam.rivera@example.test", "location": "Austin, TX", "yearsExperience": 6}`.
  Never invent an email — only use details the person supplied.
- **Expected result:** `{ status: "awaiting_human_confirmation", url:
  "/careers/signup", fields, missingRequiredFields: [], readyToConfirm:
  true, ... }` — NO session is created (`careers_get_context` still says
  `signedIn: false`).
- **Visible:** the **sign-up form opens with the fields filled and
  flashing**; a dismissible hand-off pill points at **Create account**.
- **Human confirms:** click **Create account** yourself → context now says
  `signedIn: true`. THAT click — and only that click — creates the session.
- **Signed in:** calling while signed in → `{ alreadySignedIn: true, ... }`,
  no navigation.
- **HARD RULE:** no input creates an account. If a session ever appears
  without a human click, that is a FAIL.

### 3.15 `careers_create_export` — handle, not rows

- **Call:** `{"dataset": "jobs"}` (no sign-in needed for jobs).
- **Expected result:** `{ exportId: "exp_1", dataset: "jobs", rowCount: 20,
  columns: [...], byteSize, downloadUrl: "/careers/exports/exp_1", preview:
  [3 rows], readHint }`. The ROWS are not in the result — only the handle.
- **Visible:** pill *Preparing an export · 20 rows ready*; a **Download**
  chip appears linking to the export page.
- **Human parity:** open `downloadUrl` (or click Download) → the human sees
  the identical CSV behind an **Export CSV** affordance.
- **Applications dataset:** `{"dataset": "applications"}` while signed out →
  `AUTH_REQUIRED`. Signed in → rows are your own applications only.

### 3.16 `careers_read_export` — read slices

- **Setup:** an export from §3.15 (note `exportId`).
- **Call:** `{"exportId": "exp_1", "offset": 0, "limit": 5, "columns": ["title", "compensationMax"]}`.
- **Expected result:** `{ exportId, columns, offset: 0, limit: 5, rowCount,
  returnedRows: 5, hasMore: true, rows: [...] }` — projected to the
  requested columns only.
- **Visible:** pill *Reading the export · 5 rows read*.
- **Paging:** step `offset` by `limit` until `hasMore: false` — full dataset
  reachable without any single result nearing output bounds. `limit: 101` →
  `VALIDATION_ERROR`. Unknown `exportId` → `EXPORT_NOT_FOUND`.
- **Isolation:** an applications export from another candidate session →
  `AUTH_REQUIRED`.

## 4. Interaction flows (end to end)

### Flow A — search → open → save → apply → hand-off → human submit

1. Signed in as Avery Chen. Clear site data first.
2. Search (§3.2) → confirm 6 matches and the pill.
3. Show on page (§3.12, e.g. query "platform") → search box types itself,
   list narrows, counts agree.
4. Open Staff Platform Engineer (§3.4) → real job page, title flash.
5. Save it yourself via the **Save job** button → `careers_get_saved_jobs`
   lists it (§3.5). Unsave via tool (§3.6) → button flips back. Re-save via
   tool → button flips to Saved. Both directions must work.
6. Start application (§3.9) → real form opens, prefilled.
7. Co-edit: type your own cover note BY HAND; then have the agent fill phone
   + availability (§3.10). Cover note untouched; written fields flash.
8. Hand-off (§3.11) → amber highlight on Submit, dismissible pill. **Click
   Submit Application yourself.** `careers_get_application` now shows
   `status: "submitted"`.
9. PASS if: every step's pill appeared; agent writes showed in the UI; human
   writes survived; submission required the human click.

### Flow B — STALE_APPLICATION co-edit

1. Signed in, draft open at revision R (read via §3.8).
2. Human types into the cover-note field (revision becomes R+1).
3. Agent writes with `expectedRevision: R` → `STALE_APPLICATION`,
   `{ expectedRevision: R, currentRevision: R+1 }`, human text intact.
4. Agent re-reads (revision R+1) and retries → success at R+2.
5. PASS if the stale write was refused with both revisions named and no
   human text was lost.

### Flow C — sign-up hand-off (signed out)

1. Signed out, clean slate.
2. `careers_get_context` → `signedIn: false`.
3. Agent prepares account (§3.14) → form filled, pill, pulsing Create
   account button. Context STILL `signedIn: false`.
4. Dismiss the hand-off pill via its × button → page unchanged, no session.
   (Re-run step 3 if you dismissed before reading the form.)
5. Click **Create account** → context `signedIn: true`, candidate shown.
6. PASS if no tool call ever created a session and the dismiss control
   worked.

### Flow D — export create → read slices

1. `careers_create_export {"dataset": "jobs"}` → 20 rows, 3-row preview.
2. `careers_read_export` with `columns: ["title", "compensationMax"]`,
   paging `offset` 0/5/10/15 with `limit: 5` → all 20 rows, `hasMore:
   false` at the end.
3. Open the `downloadUrl` → human-visible export page with the same file.
4. PASS if no single tool result contained all rows and the human file
   matches the agent handle.

### Flow E — AUTH_REQUIRED while signed out

1. Signed out. Call each of: `careers_get_saved_jobs`,
   `careers_set_saved_job {"jobId": "job_staff_platform", "saved": true}`,
   `careers_get_my_applications`, `careers_get_application`,
   `careers_start_application {"jobId": "job_staff_platform"}`,
   `careers_create_export {"dataset": "applications"}`.
2. Every one → `AUTH_REQUIRED`. No state changed, pill shows the error.
3. `careers_search_jobs`, `careers_get_job`, `careers_get_context` still
   succeed while signed out.
4. PASS if all six gated tools refused and the three public reads worked.

## 5. What the agent cannot do (verify the negatives)

- No tool creates an account (§3.14) and no tool submits an application
  (§3.11). There is no `confirm: true` flag — do not look for one.
- Exports and sign-up are human pages (`/careers/exports/[id]`,
  `/careers/signup`); there is no agent-only UI.
- No consent prompts: the human-click hand-offs ARE the site's own forms.
- Tool results never contain tokens, cookies, passwords, or API keys. Job
  descriptions and application text are untrusted content (results carry the
  hint; captions never quote them).

## 6. Pass/fail report template

```markdown
# Verification report — Careers WebMCP (<date>, <live URL>)

Environment: <browser + WebMCP harness, viewport>
Setup: clean slate Y/N, signed in as <…>

## Per-tool results
| Tool | Call | Result | Pill visible | UI/state change | PASS/FAIL |
| --- | --- | --- | --- | --- | --- |
| careers_get_context | … | … | Y/N | … | … |
| … (all 16) | | | | | |

## Flows
- A search→…→submit: PASS/FAIL + notes
- B STALE co-edit: PASS/FAIL + notes (revisions seen: …)
- C sign-up hand-off: PASS/FAIL + notes
- D export slices: PASS/FAIL + notes (rowCount, pages read: …)
- E AUTH_REQUIRED: PASS/FAIL + notes

## Negatives
- submit-without-click impossible: confirmed Y/N
- create-account-without-click impossible: confirmed Y/N
- no secrets in results: confirmed Y/N
- no silent tools (all 16 showed pills): confirmed Y/N

## Verdict: PASS / FAIL
Open issues: <list with tool name + observed vs expected>
```
