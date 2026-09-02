# Careers WebMCP tool reference

All tools are registered once per page load on `document.modelContext` (see
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

**Annotations:** `readOnlyHint: true`

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

**Annotations:** none (`readOnlyHint` intentionally omitted — it changes the visible page)

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

**Annotations:** none

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

**Purpose:** Submit the candidate's own draft using the same validation/submission logic as the normal submit button. Consequential — not read-only.

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

**Example output:**

```json
{ "id": "app_1", "status": "submitted", "revision": 6, "submittedAt": "2026-09-02T10:00:00.000Z" }
```

**Errors:** `AUTH_REQUIRED`, `APPLICATION_NOT_FOUND`, `APPLICATION_ALREADY_SUBMITTED`, `VALIDATION_ERROR` (missing required fields), `STALE_APPLICATION`.

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
| `UNSUPPORTED_ACTION` | Reserved for future tools. |
| `INTERNAL_ERROR` | Anything unexpected — generic message only. |

## Output bounds

- Search results: default 10, max 30.
- Job/application prose fields: capped at ~20KB each.
- Any tool result: capped at ~50KB total; bounding sets `"truncated": true` on the payload.
