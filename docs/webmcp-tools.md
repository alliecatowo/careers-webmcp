# Careers WebMCP tool reference

All 18 tools are registered once per page load on `document.modelContext` (see
`src/webmcp/register.ts`) and are feature-detected — the normal careers site
works identically with no WebMCP-capable browser present.

Every tool result is wrapped as an MCP `CallToolResult`:

```json
{ "content": [{ "type": "text", "text": "<JSON-encoded payload>" }], "structuredContent": { /* payload */ } }
```

Errors set `isError: true` and the payload is `{ "error": "<CODE>", "message": "...", ...details }`.
See "Errors" at the bottom for the full code list.

---

## careers_get_context

**Purpose:** Tell the agent where the human currently is — sign-in state, current page, current job/application, active search filters. Read-only.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true` (the current job title is site content)

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "properties": {} }
```

**Example output:**

```json
{
  "session": { "signedIn": true, "candidate": { "id": "candidate-demo", "displayName": "Avery Chen" } },
  "page": { "kind": "job_detail", "path": "/careers/countries/united-states/jobs/job_staff_platform" },
  "currentJob": { "id": "job_staff_platform", "title": "Staff Platform Engineer" },
  "search": { "query": null, "department": null, "location": null, "workplace": null },
  "application": null
}
```

**Errors:** none (always succeeds).

---

## careers_search_jobs

**Purpose:** Deterministic structured/free-text search over the same job catalog the careers site displays. No AI/embeddings.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true` (job titles/descriptions are site content)

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "query": { "type": "string" },
    "departments": { "type": "array", "items": { "type": "string" } },
    "levels": { "type": "array", "items": { "type": "string" } },
    "locations": { "type": "array", "items": { "type": "string" } },
    "workplace": { "type": "array", "items": { "type": "string" } },
    "employmentTypes": { "type": "array", "items": { "type": "string" } },
    "skills": { "type": "array", "items": { "type": "string" } },
    "minCompensation": { "type": "number" },
    "maxCompensation": { "type": "number" },
    "maxResults": { "type": "number", "minimum": 1, "maximum": 30 }
  }
}
```

**Example output:**

```json
{
  "totalMatches": 3,
  "jobs": [
    {
      "id": "job_staff_platform",
      "title": "Staff Platform Engineer",
      "department": "Engineering",
      "team": "Infrastructure",
      "level": "Staff",
      "location": "San Francisco",
      "workplace": "Hybrid",
      "employmentType": "Full-time",
      "compensation": { "min": 230000, "max": 285000, "currency": "USD" },
      "url": "/careers/countries/united-states/jobs/job_staff_platform"
    }
  ],
  "truncated": false
}
```

**Errors:** `SEARCH_LIMIT_EXCEEDED` if `maxResults > 30`; `VALIDATION_ERROR` if `maxResults < 1` or a field has the wrong type.

---

## careers_get_job

**Purpose:** Full structured detail for one public job posting, including whether the current candidate already applied/saved it.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true`

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "properties": { "jobId": { "type": "string" } } }
```

`jobId` is optional — omitted, it falls back to the current job from `careers_get_context`.

**Example output:**

```json
{
  "id": "job_staff_platform",
  "title": "Staff Platform Engineer",
  "department": "Engineering",
  "team": "Infrastructure",
  "level": "Staff",
  "locations": ["San Francisco"],
  "workplace": "Hybrid",
  "employmentType": "Full-time",
  "compensation": { "min": 230000, "max": 285000, "currency": "USD" },
  "skills": ["TypeScript", "Kubernetes"],
  "summary": "...",
  "responsibilities": ["..."],
  "requirements": ["..."],
  "application": { "alreadyApplied": false, "applicationId": null, "status": null, "saved": true }
}
```

**Errors:** `JOB_NOT_FOUND` if no `jobId` supplied and no current job in context, or the id doesn't exist.

---

## careers_open_job

**Purpose:** Navigate the current browser tab to the normal job detail page so the human can read it. View-state only — does not create an application.

**Annotations:** `untrustedContentHint: true` (`readOnlyHint` intentionally omitted — it changes the visible page; the returned job summary is site content)

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "required": ["jobId"], "properties": { "jobId": { "type": "string" } } }
```

**Example output:**

```json
{ "opened": true, "job": { "id": "job_staff_platform", "title": "Staff Platform Engineer", "url": "/careers/countries/united-states/jobs/job_staff_platform", "...": "..." } }
```

**Errors:** `JOB_NOT_FOUND`.

---

## careers_open_page

**Purpose:** Go to any page on this careers site by name. The `page` enum is the site's own map, so the agent never reconstructs a link or scrapes an `<a href>`. Candidate-scoped destinations require a session, exactly like every other candidate tool.

**Annotations:** none (`readOnlyHint` omitted — it changes the visible page).

**Destinations:**

| `page` | Path | Requires sign-in |
| --- | --- | --- |
| `careers_home` | `/careers` | no |
| `jobs` | `/careers/open-positions` | no |
| `full_time_roles` | `/careers/full-time` | no |
| `part_time_roles` | `/careers/part-time` | no |
| `hiring_process` | `/careers/hiring-process` | no |
| `internship_program` | `/careers/internship-program` | no |
| `life_at_company` | `/careers/life-at-baalvion` | no |
| `sign_up` | `/careers/signup` | no |
| `my_applications` | `/my-account?tab=applications` | **yes** |
| `saved_jobs` | `/my-account?tab=saved-jobs` | **yes** |
| `profile` | `/my-account?tab=settings` | **yes** |
| `export` | `/careers/exports/{exportId}` | no (needs `exportId`) |

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "required": ["page"],
  "properties": { "page": { "type": "string", "enum": ["careers_home", "jobs", "..."] },
                  "exportId": { "type": "string" } } }
```

**Example output:**

```json
{ "opened": true, "page": "saved_jobs", "label": "My saved jobs", "url": "/my-account?tab=saved-jobs" }
```

**Errors:** `AUTH_REQUIRED` (candidate-scoped destination while signed out), `VALIDATION_ERROR` (unknown `page`, carrying the `known` list; or `page: "export"` with no `exportId`).

---

## careers_get_site_info

**Purpose:** Read the employer's own authored careers content as structured data — the hiring process, the internship program, and every destination the agent can reach. Use it to answer "how does hiring work here?" instead of guessing or reading the rendered page.

The content lives in `src/domain/site/` and the informational pages import it from there, so what the agent reads is exactly what the human sees.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true` (publisher-authored, but treated as site content — in a real deployment it would come from a CMS an employer edits)

**Input schema:**

```json
{ "type": "object", "additionalProperties": false,
  "properties": { "topic": { "type": "string", "enum": ["hiring_process", "internship_program", "destinations"] } } }
```

Omit `topic` to get all three.

**Example output** (`topic: "hiring_process"`):

```json
{ "topic": "hiring_process",
  "hiring_process": { "label": "How hiring works here", "url": "/careers/hiring-process",
    "steps": [ { "number": "01", "name": "Apply", "description": "Submit your application for an open role..." },
               { "number": "02", "name": "Interview", "description": "..." } ] } }
```

**Errors:** `VALIDATION_ERROR` (unknown `topic`, carrying the `known` list).

---

## careers_get_saved_jobs

**Purpose:** List job postings the signed-in candidate saved via the normal "Save job" button (or via `careers_set_saved_job`) — same underlying store, no duplication.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true`

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "properties": {} }
```

**Example output:**

```json
{ "savedJobs": [{ "id": "job_staff_platform", "title": "Staff Platform Engineer", "...": "..." }] }
```

**Errors:** `AUTH_REQUIRED`.

---

## careers_set_saved_job

**Purpose:** Save or unsave a job posting, using the exact same domain operation as the human Save button.

**Annotations:** none

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["jobId", "saved"],
  "properties": { "jobId": { "type": "string" }, "saved": { "type": "boolean" } }
}
```

**Example output:**

```json
{ "jobId": "job_staff_platform", "saved": true }
```

**Errors:** `AUTH_REQUIRED`, `JOB_NOT_FOUND`.

---

## careers_get_my_applications

**Purpose:** List the signed-in candidate's own applications with status and revision.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true`

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "properties": {} }
```

**Example output:**

```json
{
  "applications": [
    { "id": "app_1", "jobId": "job_staff_platform", "jobTitle": "Staff Platform Engineer", "status": "draft", "updatedAt": "2026-09-01T12:00:00.000Z", "revision": 3, "url": "/careers/application/united-states?jobId=job_staff_platform" }
  ]
}
```

**Errors:** `AUTH_REQUIRED`.

---

## careers_get_application

**Purpose:** Read one application draft/submission — the candidate's own only. Used before every update so the agent has the current revision.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true`

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": { "applicationId": { "type": "string" }, "jobId": { "type": "string" } }
}
```

Both optional; if neither is supplied, falls back to the current application from context.

**Example output:**

```json
{
  "id": "app_1",
  "job": { "id": "job_staff_platform", "title": "Staff Platform Engineer" },
  "status": "draft",
  "revision": 4,
  "fields": {
    "fullName": "Avery Chen", "email": "avery.chen@example.test", "phone": "",
    "location": "Oakland, CA", "linkedinUrl": "...", "portfolioUrl": "",
    "yearsExperience": 7, "coverNote": "", "availability": ""
  },
  "missingRequiredFields": ["phone", "availability"],
  "url": "/careers/application/united-states?jobId=job_staff_platform"
}
```

**Errors:** `AUTH_REQUIRED`, `APPLICATION_NOT_FOUND`.

---

## careers_start_application

**Purpose:** Start (or idempotently resume) an application draft for a job, prefilled from the candidate's profile — the same flow as the normal Apply button — and navigate there.

**Annotations:** none

**Input schema:**

```json
{ "type": "object", "additionalProperties": false, "required": ["jobId"], "properties": { "jobId": { "type": "string" } } }
```

**Example output:**

```json
{ "id": "app_1", "jobId": "job_staff_platform", "status": "draft", "revision": 1, "url": "/careers/application/united-states?jobId=job_staff_platform", "created": true }
```

**Errors:** `AUTH_REQUIRED`, `JOB_NOT_FOUND`.

---

## careers_update_application

**Purpose:** Patch fields on the candidate's own draft. Only supplied keys change; unspecified fields are preserved. Requires the caller's last-read `expectedRevision` — rejected if the human has edited the draft since.

**Annotations:** `untrustedContentHint: true` (the echoed draft fields are candidate content)

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["applicationId", "expectedRevision", "fields"],
  "properties": {
    "applicationId": { "type": "string" },
    "expectedRevision": { "type": ["number", "null"] },
    "fields": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "fullName": { "type": "string" }, "email": { "type": "string" }, "phone": { "type": "string" },
        "location": { "type": "string" }, "linkedinUrl": { "type": "string" }, "portfolioUrl": { "type": "string" },
        "yearsExperience": { "type": ["number", "null"] }, "coverNote": { "type": "string" }, "availability": { "type": "string" }
      }
    }
  }
}
```

**Example output:**

```json
{ "id": "app_1", "revision": 5, "status": "draft", "fields": { "...": "..." }, "missingRequiredFields": ["availability"] }
```

**Errors:** `AUTH_REQUIRED`, `APPLICATION_NOT_FOUND`, `APPLICATION_ALREADY_SUBMITTED`, `VALIDATION_ERROR` (unknown field name or a field fails per-field rules), `STALE_APPLICATION` — exact shape:

```json
{ "error": "STALE_APPLICATION", "message": "...", "expectedRevision": 4, "currentRevision": 5 }
```

---

## careers_submit_application

**Purpose:** Validate the candidate's own draft against the same rules as the human Submit button, then open it for the person to send. **This tool does not submit.** The site deliberately reserves the irreversible click for the human.

**Annotations:** none

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["applicationId", "expectedRevision"],
  "properties": { "applicationId": { "type": "string" }, "expectedRevision": { "type": ["number", "null"] } }
}
```

**Behaviour:** enforces `expectedRevision`, runs `validateApplicationFields`, navigates to the application page, and highlights the real Submit button.

**Example output:**

```json
{
  "id": "app_1",
  "status": "awaiting_human_confirmation",
  "applicationStatus": "draft",
  "revision": 6,
  "url": "/careers/application/united-states?jobId=job_staff_platform",
  "message": "The application is filled in and valid. The person needs to press Submit on the page to send it."
}
```

If the application was already submitted it returns `{ "status": "submitted", "alreadySubmitted": true, ... }` instead.

**Errors:** `AUTH_REQUIRED`, `APPLICATION_NOT_FOUND`, `STALE_APPLICATION`, `VALIDATION_ERROR` — the last carries what is still missing:

```json
{ "error": "VALIDATION_ERROR", "message": "The application is not ready to submit.", "missingRequiredFields": ["availability"], "invalidFields": [] }
```

---

## careers_set_search_view

**Purpose:** Put a search on the site's own jobs page — types the query into the visible search box and applies the visible filters. Read results from `careers_search_jobs`; use this to *show* them.

**Annotations:** none

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "query": { "type": "string" },
    "department": { "type": "string" },
    "country": { "type": "string" },
    "level": { "type": "string" },
    "workplace": { "type": "string", "enum": ["On-site", "Hybrid", "Remote"] },
    "employmentType": { "type": "string" }
  }
}
```

`department` and `country` take the names the site displays, not ids; the tool resolves them.

**Example output:**

```json
{
  "applied": true,
  "url": "/careers/open-positions?departmentId=dept_eng_it&page=1&q=inference",
  "view": { "query": "inference", "department": "Engineering", "country": null, "level": null, "workplace": null, "employmentType": null },
  "totalMatches": 1
}
```

`totalMatches` is computed with the same scorer the visible list uses, so the number the agent reports and the number on the page always agree.

**Errors:** `VALIDATION_ERROR` — an unknown department or country, with a `known` array of the valid names.

---

## careers_focus_application_field

**Purpose:** Move the cursor to one field of the candidate's application and highlight it — for things the agent should not invent, like a phone number or a notice period.

**Annotations:** `untrustedContentHint: true` (`currentValue` is candidate content)

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["field"],
  "properties": {
    "applicationId": { "type": "string" },
    "field": { "type": "string", "enum": ["fullName", "email", "phone", "location", "linkedinUrl", "portfolioUrl", "yearsExperience", "coverNote", "availability"] }
  }
}
```

`applicationId` defaults to the application currently open on the page.

**Example output:**

```json
{ "focused": true, "applicationId": "app_1", "field": "availability", "currentValue": "", "url": "/careers/application/united-states?jobId=job_staff_platform" }
```

**Errors:** `AUTH_REQUIRED`, `APPLICATION_NOT_FOUND`, `VALIDATION_ERROR` (unknown field name).

---

## careers_create_account

**Purpose:** Fill the site's normal sign-up form with details the person supplied and open it for them to confirm. **This tool does not create an account.** Only the human-clicked Create account button creates a session.

**Annotations:** none

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["fullName", "email"],
  "properties": {
    "fullName": { "type": "string" },
    "email": { "type": "string" },
    "phone": { "type": "string" },
    "location": { "type": "string" },
    "linkedinUrl": { "type": "string" },
    "portfolioUrl": { "type": "string" },
    "yearsExperience": { "type": ["number", "null"] }
  }
}
```

**Example output:**

```json
{
  "status": "awaiting_human_confirmation",
  "url": "/careers/signup",
  "fields": { "fullName": "Sam Rivera", "email": "sam.rivera@example.test", "phone": "", "location": "Austin, TX", "linkedinUrl": "", "portfolioUrl": "", "yearsExperience": 6 },
  "missingRequiredFields": [],
  "invalidFields": [],
  "readyToConfirm": true,
  "message": "The sign-up form is filled in. The person needs to press Create account to finish."
}
```

If a candidate is already signed in the tool is a no-op and returns `{ "alreadySignedIn": true, "candidate": { "id": "...", "displayName": "..." } }`.

After the human confirms, `careers_get_context` reports `session.signedIn: true` — that is how the agent learns the account exists.

**Errors:** `VALIDATION_ERROR` — missing `fullName`/`email`, or an unknown field name. A malformed email is not an error: it comes back in `invalidFields` with `readyToConfirm: false`, so the agent can correct it.

---

## careers_create_export

**Purpose:** Build a downloadable CSV and return a **handle** to it — row count, columns and a three-row preview — instead of the rows. Lets an agent work over a whole result set without any tool result approaching the output bound.

**Annotations:** `untrustedContentHint: true`

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "dataset": { "type": "string", "enum": ["jobs", "applications"], "default": "jobs" },
    "query": { "description": "Optional job filters, same shape as careers_search_jobs. Ignored for the applications dataset." },
    "columns": { "type": "array", "items": { "type": "string" } }
  }
}
```

The `jobs` dataset is ranked with `filterAndRankJobs` — the same scorer as `careers_search_jobs`, but without the search page limit, because these rows never enter a tool result. The registry still caps an export at 500 rows.

**Example output:**

```json
{
  "exportId": "exp_1",
  "dataset": "jobs",
  "format": "csv",
  "label": "All open positions",
  "rowCount": 20,
  "columns": ["id", "title", "department", "team", "level", "location", "workplace", "employmentType", "compensationMin", "compensationMax", "currency", "skills", "postedAt", "url"],
  "byteSize": 4820,
  "downloadUrl": "/careers/exports/exp_1",
  "preview": [{ "id": "job_staff_platform", "title": "Staff Platform Engineer", "...": "..." }],
  "readHint": "Rows are not included here. Call careers_read_export with this exportId, an offset, a limit of up to 100, and only the columns you need."
}
```

The same file is reachable by the human from the **Export CSV** button on the jobs page and from `downloadUrl`. Exports live in `sessionStorage` — they are scoped to the tab and gone when it closes.

**Errors:** `AUTH_REQUIRED` (applications dataset while signed out), `VALIDATION_ERROR` (unknown dataset, or a bad `query`).

---

## careers_read_export

**Purpose:** Read a bounded window of rows from an export, projected to only the columns you need.

**Annotations:** `readOnlyHint: true`, `untrustedContentHint: true`

**Input schema:**

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["exportId"],
  "properties": {
    "exportId": { "type": "string" },
    "offset": { "type": "number", "minimum": 0, "default": 0 },
    "limit": { "type": "number", "minimum": 1, "maximum": 100, "default": 100 },
    "columns": { "type": "array", "items": { "type": "string" } }
  }
}
```

Unknown column names are ignored; if the projection matches nothing, all columns are returned.

**Example output:**

```json
{
  "exportId": "exp_1",
  "dataset": "jobs",
  "columns": ["title", "compensationMax"],
  "offset": 0,
  "limit": 5,
  "rowCount": 20,
  "returnedRows": 5,
  "hasMore": true,
  "rows": [{ "title": "Member of Technical Staff, Post-Training", "compensationMax": "575000" }]
}
```

**Errors:** `EXPORT_NOT_FOUND`, `AUTH_REQUIRED` (an applications export belonging to a different candidate session), `VALIDATION_ERROR` (`limit` above 100).

---

## Errors

Every tool failure returns `{ "error": "<CODE>", "message": "human-readable, no internal detail", ...details }` with `isError: true`. No stack traces, no secrets. Codes:

| Code | Meaning |
| --- | --- |
| `WEBMCP_UNAVAILABLE` | Reserved — the site never calls tools when `document.modelContext` is absent. |
| `AUTH_REQUIRED` | The tool needs a signed-in candidate. |
| `JOB_NOT_FOUND` | Unknown/unpublished `jobId`. |
| `APPLICATION_NOT_FOUND` | Unknown application, or not owned by the current candidate. |
| `APPLICATION_ALREADY_SUBMITTED` | Attempted to mutate a submitted application. |
| `STALE_APPLICATION` | `expectedRevision` doesn't match the current draft revision; reread and retry. |
| `VALIDATION_ERROR` | Bad input shape or a field failed the same per-field rules the human form uses. |
| `SEARCH_LIMIT_EXCEEDED` | `maxResults` above the hard cap (30). |
| `EXPORT_NOT_FOUND` | Unknown `exportId`. Exports are per-tab and do not survive closing it. |
| `UNSUPPORTED_ACTION` | Reserved for future tools. |
| `INTERNAL_ERROR` | Anything unexpected — generic message only. |

## Output bounds

- Search results: default 10, max 30.
- Job/application prose fields: capped at ~20KB each.
- Any tool result: capped at ~50KB total; bounding sets `"truncated": true` on the payload.
- Exports: 500 rows retained per export, 100 rows per `careers_read_export` call. Export rows never travel inside a tool result — only handles, previews and requested slices do.

## Actions the agent cannot take

Two capabilities are exposed but deliberately stop short of completing:

| Tool | What it does | What only the human can do |
| --- | --- | --- |
| `careers_create_account` | Fills the real sign-up form and opens it | Press **Create account**, which creates the session |
| `careers_submit_application` | Validates the draft and opens it for review | Press **Submit Application**, which sends it |

Both return `status: "awaiting_human_confirmation"`. There is no `confirm: true`
escape hatch and no second code path — the site has exactly one way to create a
session and one way to submit an application, and both are behind a human click.
