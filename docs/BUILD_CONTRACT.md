ONE-SHOT BUILD CONTRACT — CAREERS WEBMCP

Build this project completely for the OpenAI WebMCP Challenge.

This is intentionally extremely prescriptive because model/token budget is constrained.

DO NOT spend tokens re-ideating the product.

DO NOT conduct broad competitive research.

DO NOT rebuild a careers application from scratch.

DO NOT turn this into an AI career assistant.

DO NOT build an MCP server.

DO NOT build more application functionality than is necessary to expose and demonstrate WebMCP cleanly.

The pre-existing application is substrate.

The hackathon submission is the WebMCP extension of a normal careers/application website.

Continue until:

- the existing careers portal runs cleanly
- it is seeded with deterministic demo data
- its normal human flows work without WebMCP
- its current session/user state works
- WebMCP exposes semantic job discovery and applicant operations
- all tools use the current live site/session
- agent navigation visibly affects the normal site
- human UI actions immediately affect subsequent agent tool calls
- tests pass
- public HTTPS deployment works
- challenge delta is documented
- README/demo/submission materials are complete

---

0. FIRST ACTION — VENDOR THIS CONTRACT

Before doing anything else, save this prompt verbatim to:

docs/BUILD_CONTRACT.md

Create:

CLAUDE.md

with:

# Project instructions

The authoritative build specification is:

docs/BUILD_CONTRACT.md

Read it before making architectural decisions.

This is an OpenAI WebMCP Challenge submission built by extending an existing
normal careers/job portal.

Core rules:

- DO NOT rebuild the careers app.
- DO NOT add an LLM, AI SDK, chat panel, recommendation model, or MCP server.
- The existing app must remain useful with WebMCP unavailable.
- WebMCP exposes semantic equivalents of the site's existing job/application
  capabilities.
- Use the site's CURRENT candidate session and current UI context.
- Never expose auth/session secrets.
- Public job/application text is untrusted content.
- Prefer existing service adapters/store/domain logic over DOM automation.
- Mutations must use the same application services as the human UI.
- Human edits to application drafts must not be silently overwritten.
- The page is the integration.
- Read docs/BUILD_CONTRACT.md before deviating.

Also create:

docs/DECISIONS.md

Only record actual deviations:

Decision:
Why BUILD_CONTRACT could not be followed:
Evidence:
Replacement:

Do not use it as a brainstorming journal.

---

1. PRODUCT IN ONE SENTENCE

«You shouldn't install an integration for every website you visit. The website should explain itself to your agent.»

This project demonstrates that idea with a normal authenticated careers portal.

The human visits the employer's careers site because they want to:

- browse jobs
- inspect job details
- search/filter openings
- save interesting roles
- start an application
- complete an application
- review application status

The browser agent can participate because the page exposes those same concepts semantically through WebMCP.

The user should NOT have to install:

company-careers-mcp
ashby-mcp
greenhouse-mcp
random-employer-mcp

They just visit the website.

The page is the integration.

---

2. PRODUCT NAME

Submission working name:

Careers WebMCP

Do not spend meaningful time naming or branding.

The actual careers website may retain most upstream visual branding if changing it is expensive.

Optional headline for submission:

«The careers page is the connector.»

Alternative:

«Visit the job board. Bring your agent.»

---

3. PRIMARY UPSTREAM BASE

Use:

https://github.com/baalvionservice/Baalvion-Jobs-Portal

MIT licensed.

Clone/fork this as the starting point.

Use the upstream state at the time implementation begins.

Immediately record:

upstream repository URL
upstream commit SHA
date cloned
license

in:

docs/UPSTREAM.md

Do NOT rewrite the project from scratch unless it fundamentally cannot run.

Reasons this base was selected:

- Next.js
- TypeScript
- Tailwind
- shadcn/Radix-style UI
- public jobs portal
- detailed job pages
- candidate application flow
- applicant-facing functionality
- existing service/data abstractions
- mock data architecture
- designed so UI can work independently of backend
- MIT license

The application itself is not the novelty.

Reuse it aggressively.

---

4. HARD FALLBACK BASE

ONLY if the primary repository cannot be made to run in a clean deterministic mock/demo configuration after one focused baseline investigation, use:

https://github.com/adithya-69/Job_application_portal

Reasons:

- MIT
- React/Vite
- job search
- filtering
- login
- candidate profile
- applications
- application tracking
- admin
- all persistence in localStorage
- no backend required

DO NOT investigate both projects in parallel.

Start Baalvion.

Fallback only if a concrete blocker exists such as:

- core candidate portal fundamentally requires unavailable Firebase resources
- checked-in mock adapter cannot support normal applicant flow
- production build is irreparably broken
- authentication cannot be made deterministic without rewriting substantial app architecture

If fallback occurs:

record exact reason in "docs/DECISIONS.md".

Then stop touching Baalvion.

---

5. EXISTING PROJECT / CHALLENGE DELTA

This uses a pre-existing open-source application.

That is intentional.

The Challenge contribution is the WebMCP extension.

Create:

docs/CHALLENGE_DELTA.md

It must clearly separate:

Pre-existing upstream functionality

Examples:

- careers UI
- job cards
- job pages
- candidate portal
- application forms
- admin views
- generic styling
- service adapters
- mock data

Challenge-period work

Examples:

- WebMCP semantic layer
- WebMCP tool registration
- live route/current-job context
- semantic job query engine
- current-session-aware saved jobs
- WebMCP application draft operations
- navigation/focus operations
- concurrency/revision protection
- output bounding
- untrusted-content handling
- tests
- demo fixtures added specifically for WebMCP
- docs
- WebMCP diagnostics

Be extremely transparent.

Do not attempt to present upstream UI work as hackathon work.

That transparency is a feature, not a weakness.

---

6. CORE WEBMCP THESIS

This project is NOT demonstrating:

«AI can search a job database.»

Any API/MCP could do that.

It demonstrates:

«An ordinary destination website can advertise its semantic capabilities to the browser agent already accompanying the user.»

The website already has:

- its current job catalog
- its current employer
- current user session
- current candidate identity
- current saved jobs
- current applications
- current application drafts
- current job page
- current search filters
- current authorization/permissions

The agent should inherit this context simply because the user is already there.

No connector installation.

No copied auth token.

No ATS-specific browser scraping.

No DOM guessing.

---

7. THIS IS NOT AN AI APP

There must be:

- no OpenAI SDK
- no Anthropic SDK
- no Google AI SDK used by our challenge features
- no model API
- no embedded chat
- no AI sidebar
- no AI recommendation engine
- no AI resume scoring
- no generated cover letters
- no semantic embedding database
- no automatic agent invocation
- no agent daemon
- no MCP server

If upstream contains dormant/planned AI code or dependencies:

DO NOT integrate it.

If it interferes with the build, disable/remove only what is necessary.

The site must remain a normal careers portal.

---

8. FIRST TECHNICAL GOAL

Before adding WebMCP:

npm/pnpm install
build
run

the upstream app.

Find the smallest way to enable its mock/demo service adapter.

The entire demo must work without external Firebase/database credentials if at all possible.

The desired runtime for challenge judging is:

public Next.js site
+
deterministic mock/demo data
+
browser/local mock candidate session
+
WebMCP

Do NOT add:

- Supabase
- Neon
- Postgres
- MongoDB
- Redis
- Prisma
- Drizzle
- Clerk
- Auth0
- external ATS
- Greenhouse
- Ashby API

unless upstream literally cannot function otherwise.

The point is not backend engineering.

---

9. MODEL/TOKEN STRATEGY

Use cheap workers aggressively for narrow work.

Do NOT use expensive agents for repository exploration.

Recommended:

Haiku:
- source reconnaissance
- existing architecture mapping
- test inventory
- final contract audit

Sonnet:
- implementation
- WebMCP service layer
- UI/session integration
- tests
- demo seeding

Strong lead:
- preserve architecture
- resolve seams
- integration
- final fixes

Maximum useful parallelism:

3-4 workers

Do not create massive orchestration.

This is not a greenfield app.

---

10. EXACT INITIAL AGENT TOPOLOGY

Run two scouts only.

Haiku Scout A — application architecture

READ ONLY.

Prompt:

«Inspect the existing careers repository only enough to identify:

1. public jobs listing route/page
2. job detail route/page
3. job data source/service
4. filtering/search implementation
5. current user/session implementation
6. saved/favorite jobs implementation if any
7. application flow
8. application draft/storage implementation
9. mock/service adapter architecture
10. easiest deterministic demo mode requiring no external backend

Do not summarize the entire repository.

Identify the canonical domain/service functions the normal UI already calls.

WebMCP must call those functions, not scrape DOM.

Write a concise map to:

docs/research/app-map.md

Include exact source paths and function/store names.

Do not change code.»

Haiku Scout B — baseline/build blockers

Prompt:

«Run/install/build the upstream project and identify only blockers to a deterministic public demo.

Determine:

- package manager
- required environment variables
- whether mock services work without Firebase
- whether candidate login/session can run in demo mode
- whether application state can be persisted locally/mock-side
- whether build passes

Fix NOTHING.

Write a concise report to:

docs/research/baseline.md

Do not research WebMCP or product ideas.»

Lead reads both once.

If primary base is viable:

STOP researching alternatives.

---

11. ARCHITECTURE

Keep existing app architecture.

Add a semantic adapter:

Existing UI
    ↓
existing domain/services/store
    ↑
WebMCP semantic adapter

NOT:

WebMCP
    ↓
querySelector()
click()
scrape rendered cards

The normal UI and WebMCP must operate on the same state/services.

Conceptually:

┌────────────────────────────────────┐
│ Careers Website                    │
│                                    │
│ Human UI                           │
│   ↕                                │
│ Candidate/job domain state         │
│   ↕                                │
│ Existing services / mock adapter   │
│   ↕                                │
│ WebMCP semantic adapter            │
│   ↕                                │
│ document.modelContext              │
└────────────────┬───────────────────┘
                 │
                 ▼
        compatible browser agent

---

12. NEW SOURCE LAYOUT

Adapt to upstream conventions, but create approximately:

src/
├── webmcp/
│   ├── index.ts
│   ├── register.ts
│   ├── tools.ts
│   ├── schemas.ts
│   ├── results.ts
│   ├── errors.ts
│   ├── context.ts
│   ├── navigation.ts
│   └── revision.ts
│
├── domain/
│   └── ... existing
│
├── services/
│   └── ... existing
│
└── ...

docs/
├── BUILD_CONTRACT.md
├── DECISIONS.md
├── UPSTREAM.md
├── CHALLENGE_DELTA.md
├── architecture.md
├── webmcp-tools.md
├── demo-script.md
└── submission.md

tests/
├── webmcp-shim.ts
└── ...

Do not reorganize unrelated upstream folders.

---

13. WEBMCP API

Use current imperative API:

document.modelContext.registerTool(...)

Do NOT use:

navigator.modelContext
provideContext

Feature detect.

If unavailable:

normal careers site remains completely functional.

No fake production polyfill.

Use test-only shim for tests.

---

14. STABLE TOOL SET

Unlike Swagger, the site has a stable semantic model.

Register tools ONCE.

Do not dynamically re-register based on:

- route
- current job
- login
- saved-job state
- application state

Those are runtime state.

Tools inspect current state at invocation time.

Do not use "toolchange" as arbitrary application event signaling.

---

15. WEBMCP LIMITATION

The site cannot proactively wake the agent.

Therefore:

- opening a job does not summon agent
- saving a job does not summon agent
- editing application does not summon agent
- changing filters does not summon agent

Those actions merely change what the agent sees next time the human invokes it.

No sparkle buttons.

No "Ask AI."

---

16. TOOL SURFACE — EXACT V1

Implement this set.

Prefer these names:

careers_get_context
careers_search_jobs
careers_get_job
careers_open_job
careers_get_saved_jobs
careers_set_saved_job
careers_get_my_applications
careers_get_application
careers_start_application
careers_update_application
careers_submit_application

If upstream has no saved-jobs concept and implementing it would require major work:

saved-jobs tools may be implemented with lightweight local persistence.

Do not remove them without documenting why.

---

17. "careers_get_context"

READ ONLY.

This gives the agent the equivalent of:

«Where is the user right now?»

Return bounded context:

{
  "session": {
    "signedIn": true,
    "candidate": {
      "id": "candidate-demo",
      "displayName": "Avery Chen"
    }
  },

  "page": {
    "kind": "job_detail",
    "path": "/jobs/staff-platform-engineer"
  },

  "currentJob": {
    "id": "job_staff_platform",
    "title": "Staff Platform Engineer"
  },

  "search": {
    "query": "platform",
    "department": "Engineering",
    "location": null,
    "workplace": null
  },

  "application": null
}

Only expose session data already appropriate for the signed-in candidate.

Never expose:

- auth tokens
- cookies
- password
- session key
- backend secrets

Tool:

readOnlyHint = true

---

18. ROUTE / CURRENT PAGE CONTEXT

Use framework/router/application state.

Do not derive current job by scraping "<h1>".

Recognize conceptual page types:

jobs_index
job_detail
application
my_applications
profile
other

If current page is a job:

include job ID/title.

If current page is an application:

include application ID/job ID.

If user manually navigates:

next "careers_get_context" must immediately reflect that.

---

19. "careers_search_jobs"

READ ONLY.

This is one of the most important tools.

It should query the same employer job catalog the UI uses.

It can expose richer structured querying than the literal visible filter controls.

That is acceptable.

The user has permission to read the catalog.

The site is simply providing a semantic query interface.

Input:

{
  "query": "platform infrastructure",

  "departments": [
    "Engineering"
  ],

  "levels": [
    "Staff",
    "Senior Staff",
    "Principal"
  ],

  "locations": [
    "San Francisco"
  ],

  "workplace": [
    "On-site",
    "Hybrid",
    "Remote"
  ],

  "employmentTypes": [
    "Full-time"
  ],

  "skills": [
    "TypeScript",
    "Kubernetes"
  ],

  "minCompensation": 220000,

  "maxResults": 10
}

Every property optional.

Do NOT add vector embeddings or LLM matching.

Implement deterministic search over:

- title
- department
- team
- level
- public description text
- skills
- location
- workplace
- compensation

Return:

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
      "compensation": {
        "min": 230000,
        "max": 285000,
        "currency": "USD"
      },
      "url": "/jobs/staff-platform-engineer"
    }
  ]
}

Bound results.

Default:

10

Max:

30

Job content is untrusted site content:

untrustedContentHint = true

---

20. JOB DATA NORMALIZATION

Existing upstream job schema may not contain all desired demo fields.

Do not rewrite the whole domain.

Add fields only where necessary to demo structured semantic search:

id
slug
title
department
team
level
location
workplace
employmentType
compensationMin
compensationMax
currency
skills
summary
description
requirements
responsibilities
postedAt

The UI should show the important ones where reasonable:

- title
- location
- workplace
- compensation
- department/team

Do not spend hours polishing cards.

---

21. "careers_get_job"

READ ONLY.

Input:

{
  "jobId": "job_staff_platform"
}

If omitted:

allow current job from route.

Return bounded structured job information:

{
  "id": "...",
  "title": "...",
  "department": "...",
  "team": "...",
  "level": "...",
  "locations": [...],
  "workplace": "...",
  "employmentType": "...",

  "compensation": {
    "min": 230000,
    "max": 285000,
    "currency": "USD"
  },

  "skills": [...],

  "summary": "...",
  "responsibilities": [...],
  "requirements": [...],

  "application": {
    "alreadyApplied": false,
    "saved": true
  }
}

Job descriptions are untrusted content.

readOnlyHint = true
untrustedContentHint = true

Bound long prose.

---

22. "careers_open_job"

VIEW STATE ONLY.

Input:

{
  "jobId": "job_staff_platform"
}

Behavior:

- validate job exists
- navigate using normal app router
- display the real existing job detail page
- scroll appropriately

Return compact job summary/current context.

This is essential because:

agent finds role
→ opens it
→ human visually reads the normal careers page

Do not build an agent-only job preview.

---

23. SAVED JOBS

If upstream already has save/favorite functionality:

reuse it.

Otherwise implement tiny normal candidate feature.

It must work without WebMCP.

Human can click:

Save job

Agent can use same domain operation.

Persist via existing mock/session adapter or localStorage.

---

24. "careers_get_saved_jobs"

READ ONLY.

Requires signed-in candidate if site semantics require it.

Return bounded saved-job summaries.

No secrets.

---

25. "careers_set_saved_job"

MUTATING.

Input:

{
  "jobId": "...",
  "saved": true
}

Uses same underlying operation as human Save button.

Do not duplicate state.

Return resulting saved state.

If signed out:

AUTH_REQUIRED

Do not silently create session.

---

26. APPLICATION MODEL

The demo requires a realistic but simple application.

Avoid file-upload complexity in WebMCP.

The normal human UI MAY have resume upload if upstream already supports it.

The WebMCP v1 does not need to upload files.

The application should have enough normal fields to demonstrate draft collaboration.

Recommended semantic fields:

fullName
email
phone
location
linkedinUrl
portfolioUrl
yearsExperience
coverNote
availability

If upstream uses a different schema:

map between these semantic fields and existing form/domain fields where reasonable.

Do NOT add:

- demographic questionnaire
- disability data
- race/ethnicity
- gender
- veteran status
- medical fields

This is a fictional demo.

Keep sensitive hiring data out.

---

27. APPLICATION REVISION

Applications are collaborative live state.

Human may edit the form while agent is reasoning.

Use revision protection.

Each draft has:

revision

A simple monotonic integer is sufficient.

Example:

{
  "id": "app_123",
  "revision": 4
}

Any mutation tool must include:

expectedRevision

If user changed the form since agent read it:

reject.

Return:

{
  "error": "STALE_APPLICATION",
  "expectedRevision": 3,
  "currentRevision": 4
}

Agent must reread.

Human state wins.

---

28. "careers_get_my_applications"

READ ONLY.

Requires current signed-in candidate.

Return summaries:

{
  "applications": [
    {
      "id": "app_123",
      "jobId": "...",
      "jobTitle": "Staff Platform Engineer",
      "status": "draft",
      "updatedAt": "...",
      "revision": 4
    }
  ]
}

Statuses:

draft
submitted
withdrawn

Optional seeded post-submit statuses if upstream has them:

review
interview
rejected
offer

Do not add recruiter workflow just for WebMCP.

---

29. "careers_get_application"

READ ONLY.

Input:

{
  "applicationId": "app_123"
}

or:

{
  "jobId": "job_staff_platform"
}

If current route is application and neither supplied:

current application may be default.

Return:

{
  "id": "app_123",
  "job": {
    "id": "...",
    "title": "Staff Platform Engineer"
  },

  "status": "draft",
  "revision": 4,

  "fields": {
    "fullName": "Avery Chen",
    "email": "avery@example.test",
    "phone": "",
    "location": "Oakland, CA",
    "linkedinUrl": "",
    "portfolioUrl": "",
    "yearsExperience": 7,
    "coverNote": "",
    "availability": ""
  },

  "missingRequiredFields": [
    "phone"
  ]
}

Only return candidate's own application.

---

30. "careers_start_application"

MUTATING.

Input:

{
  "jobId": "job_staff_platform"
}

Behavior:

- require current signed-in candidate
- if draft already exists, return/open it instead of creating duplicate
- create through same application service the human UI uses
- prefill allowed profile fields just like normal application UI
- navigate to normal application page
- return application ID/revision

This is a strong WebMCP interaction:

agent finds job
→ starts application
→ normal application UI opens
→ human can manually continue

---

31. "careers_update_application"

MUTATING.

Input:

{
  "applicationId": "app_123",
  "expectedRevision": 4,

  "fields": {
    "phone": "+1 555 0100",
    "portfolioUrl": "https://example.test",
    "coverNote": "..."
  }
}

Only update supplied fields.

Do not erase unspecified fields.

Validate using same validation rules as human form.

Use shared domain/service implementation.

After mutation:

- form UI should reflect changes
- revision increments
- draft persists

If stale:

reject.

Do not silently overwrite human edits.

---

32. "careers_submit_application"

MUTATING / CONSEQUENTIAL.

Input:

{
  "applicationId": "app_123",
  "expectedRevision": 5
}

Validate required fields.

Use normal application submission logic.

Status becomes:

submitted

Navigate to/reflect normal confirmation UI where possible.

WebMCP tool should be:

readOnlyHint = false

The demo does NOT have to use automated submission.

The best demo may deliberately have the human inspect and submit manually.

But the site capability may still be exposed.

---

33. HUMAN + AGENT SHARED APPLICATION FLOW

This is a key collaboration example.

Agent:

start_application

Normal application page opens.

Agent fills some draft fields.

Human manually changes:

cover note
availability
portfolio URL

Then asks:

«“Fill the remaining missing fields, but keep what I changed.”»

Agent:

1. reads current application
2. sees incremented revision
3. updates only missing fields
4. preserves human edits

This is much better than a separate application bot.

---

34. CURRENT SESSION

Do not invent global agent identity.

The site has a current candidate session.

WebMCP inherits it.

Demo candidate:

Avery Chen

or use whatever upstream demo user already supports.

The user should be able to sign in through a normal UI.

For challenge reliability, a button like:

Continue as demo candidate

is acceptable.

This should create the SAME session used by normal UI.

Do not have separate WebMCP auth.

---

35. NO AUTH SECRET EXPOSURE

Never return:

- password
- Firebase tokens
- cookies
- local auth tokens
- JWT
- refresh token
- API keys

Context only needs:

{
  "signedIn": true,
  "candidate": {
    "id": "...",
    "displayName": "Avery Chen"
  }
}

If using localStorage demo session:

WebMCP should still use the normal session abstraction rather than directly dumping localStorage.

---

36. UNTRUSTED CONTENT

Job descriptions are site/user content.

Application free-text is user content.

WebMCP tools returning this should use:

untrustedContentHint = true

Do not copy job descriptions into privileged tool descriptions.

Tool description:

GOOD:

«Retrieve a public job opening from the current careers site.»

BAD:

«${job.description}»

Tool metadata is authored by us.

Returned job content is untrusted.

---

37. OUTPUT BOUNDS

Do not dump massive job descriptions/catalogs.

Central limits.

Suggested:

search results default: 10
search results max: 30
job prose max: ~20 KB
application prose max: ~20 KB
tool result max: ~50 KB

Explicit truncation:

{
  "truncated": true
}

---

38. ERROR MODEL

Use structured errors:

WEBMCP_UNAVAILABLE
AUTH_REQUIRED
JOB_NOT_FOUND
APPLICATION_NOT_FOUND
APPLICATION_ALREADY_SUBMITTED
STALE_APPLICATION
VALIDATION_ERROR
SEARCH_LIMIT_EXCEEDED
UNSUPPORTED_ACTION
INTERNAL_ERROR

Example:

{
  "error": "AUTH_REQUIRED",
  "message": "Sign in to save jobs or manage applications."
}

No giant stack traces.

---

39. WEBMCP ANNOTATIONS

Read tools:

careers_get_context
careers_search_jobs
careers_get_job
careers_get_saved_jobs
careers_get_my_applications
careers_get_application

set:

readOnlyHint = true

Content-returning tools:

untrustedContentHint = true

where they include job descriptions or user-entered data.

Mutations:

careers_open_job
careers_set_saved_job
careers_start_application
careers_update_application
careers_submit_application

do not claim read-only.

"careers_open_job" only mutates browser view, but it still has a side effect.

---

40. SEARCH IMPLEMENTATION

Do NOT use AI.

A deterministic scorer is enough.

Possible algorithm:

1. apply hard filters:
   
   - department
   - level
   - location
   - workplace
   - employment type
   - compensation

2. tokenize textual query

3. simple weighted substring/token scoring:
   
   - title: high weight
   - team/department: medium
   - skills: medium
   - description: low

4. stable sort:
   
   - score descending
   - posted date descending

This is NOT a recommendation model.

It is a semantic site query.

---

41. DEMO DATA

Seed enough jobs to make search convincing:

12-18 jobs

Do not seed 100.

Use realistic diversity.

Recommended Engineering roles:

Staff Platform Engineer
Staff AI Infrastructure Engineer
Senior Backend Engineer
Principal Reliability Engineer
Senior Frontend Engineer
Machine Learning Engineer
Developer Productivity Engineer
Security Engineer

Also:

Product Designer
Product Manager
Technical Program Manager
Solutions Engineer
Recruiter
Data Analyst

Locations:

San Francisco
New York
Seattle
Remote — US

Workplace:

On-site
Hybrid
Remote

Comp ranges deliberately vary.

Example:

Staff Platform Engineer

$230k–$285k
Engineering
Infrastructure
Staff
San Francisco
Hybrid

Staff AI Infrastructure Engineer

$245k–$300k
Engineering
AI Platform
Staff
San Francisco
On-site

Senior Backend Engineer

$190k–$230k
Engineering
Core Product
Senior
Remote — US

This enables an immediately understandable query:

«“Show me engineering roles in SF or remote at staff level or higher paying at least $220k.”»

---

42. NORMAL HUMAN UI MUST DISPLAY THE DATA

Do not create fields exclusively for agent search that the human can never inspect.

If compensation is searchable:

show compensation on:

- job card or detail page

If level is searchable:

show level somewhere in job detail.

If workplace is searchable:

show it.

The exact filter need not exist visually.

But the information itself should be visible to the user.

---

43. OPTIONAL SEARCH UI ENHANCEMENT

If cheap:

add UI filters matching key structured fields:

department
location
workplace

Do NOT delay WebMCP work building salary slider/advanced search.

The agent may have richer query composition than the visible UI.

That is acceptable.

---

44. TEST-ONLY WEBMCP SHIM

Implement:

tests/webmcp-shim.ts

It should:

- capture registered tool definitions
- allow callback invocation
- provide AbortSignal
- inspect annotations
- record result

TEST ONLY.

Production:

feature-detect real API.

No production polyfill.

---

45. UNIT TESTS

Cover:

search

- keywords
- title weighting
- department
- level
- workplace
- location
- minimum compensation
- combined filters
- result bounds
- no matches

jobs

- get valid job
- missing job
- bounded description

context

- signed out
- signed in
- current jobs page
- current job detail
- current application

saved jobs

- save
- unsave
- current candidate isolation if relevant

applications

- start
- duplicate start returns same draft
- get
- partial update
- field validation
- revision increments
- stale revision rejected
- submission validation
- submission
- cannot mutate submitted app

security

- no auth secrets in results

---

46. BROWSER INTEGRATION TESTS

Use Playwright if existing repo has no test framework.

Mandatory:

No WebMCP

Load app without shim.

Normal job browsing works.

Registration

Load with shim.

Expected tools register once.

Human → agent route context

Human clicks Staff Platform Engineer.

Invoke:

careers_get_context

Must report that job.

Search

Invoke structured query.

Expected jobs returned.

Agent → human navigation

Invoke:

careers_open_job

Browser visibly navigates to correct normal job page.

Human saves job

Click normal Save button.

Invoke:

careers_get_saved_jobs

Saved job appears.

Agent saves job

Invoke tool.

Normal UI reflects saved state.

Start application

Invoke:

careers_start_application

Normal application page opens.

Agent fills application

Invoke update.

Visible form updates.

Human modifies application

Type manually into form.

Read application.

Updated state/revision visible.

Stale protection

1. agent reads revision
2. human changes form
3. agent attempts old revision update
4. receives "STALE_APPLICATION"
5. human edit survives

CRITICAL.

Submission

Test submit path.

Signed-out enforcement

Signed-out save/start/update returns "AUTH_REQUIRED".

---

47. NORMAL APPLICATION FORM STATE

A key implementation requirement:

When agent updates application through service/domain layer:

the open React form must update.

Do not maintain two disconnected copies:

form local state
vs
WebMCP application state

If upstream form currently owns isolated local state:

refactor minimally so canonical draft lives in:

- shared store
- context
- domain state
- mock adapter

and form subscribes.

Do not rewrite the whole app.

This shared state is important for visual demo.

---

48. NORMAL SAVE STATE

Likewise:

human clicking Save and agent "careers_set_saved_job" must operate on same canonical storage.

No duplicated WebMCP state.

---

49. OPTIONAL "careers_focus_application_field"

ONLY if core works early.

Tool:

careers_focus_application_field

Input:

{
  "applicationId": "...",
  "field": "portfolioUrl"
}

Navigate/open application and focus the normal form field.

This would enable:

«“You still need your portfolio URL.”»

Agent can point user directly at the field.

Nice WebMCP shared-context demo.

Not required.

---

50. DEMO EXPERIENCE

The app is intentionally a normal careers site.

The video should NOT begin with WebMCP architecture.

Begin with the website.

---

51. GOLDEN VIDEO — SCENE 1

Show careers homepage/jobs.

Narration approximately:

«“This is just a careers site. Without WebMCP, you browse jobs, save roles, and apply exactly like any other employer portal.”»

Manually:

- search/filter once
- open a job
- show compensation/details

Very brief.

---

52. GOLDEN VIDEO — SCENE 2

Human signs in:

Continue as Avery Chen

No agent yet.

This establishes session.

---

53. GOLDEN VIDEO — SCENE 3

Ask browser agent:

«“What engineering roles here are staff level or above, in San Francisco or remote, with a base range starting at at least $220k?”»

Agent calls:

careers_search_jobs

Returns:

Staff Platform Engineer
Staff AI Infrastructure Engineer
Principal Reliability Engineer

This demonstrates semantic query over the site.

No scraping.

No careers-site-specific connector installed by user.

---

54. GOLDEN VIDEO — SCENE 4

Ask:

«“Open the Staff Platform Engineer role.”»

Agent:

careers_open_job

The normal job page visibly opens.

Human manually scrolls/reads.

This is important.

Agent did not replace the website.

It navigated the website for the user.

---

55. GOLDEN VIDEO — SCENE 5

Human manually clicks:

Save

Then ask:

«“What have I saved?”»

Agent:

careers_get_saved_jobs

immediately sees human action.

This is a clean:

human UI action
→ shared website state
→ agent semantic access

moment.

---

56. GOLDEN VIDEO — SCENE 6

Ask:

«“Start an application for this one.”»

Agent:

careers_start_application

Normal application form opens.

Existing profile fields prepopulate.

Agent may fill one or two non-sensitive fields with explicit user-provided/demo values.

For example:

portfolio URL
years experience
availability

Form visibly updates.

---

57. GOLDEN VIDEO — SCENE 7

Human manually changes cover note.

Then:

«“Keep my changes and fill any remaining required fields.”»

Agent:

careers_get_application
careers_update_application

Current revision ensures human edits are preserved.

Normal form updates.

Optional:

human manually clicks Submit.

This emphasizes:

agent helps inside the site
human remains in control

---

58. FINAL VIDEO LINE

End with:

«“You shouldn't install an integration for every website you visit. With WebMCP, the website itself can be the connector.”»

Alternative:

«“The careers page already knows the jobs, the application, and who you're signed in as. WebMCP lets the agent use that same context instead of scraping the page or asking you to install another connector.”»

---

59. WHY WEBMCP — README SECTION

Explain comparison honestly:

| Traditional MCP| Careers WebMCP
Setup| User installs connector| Visit website
Lifetime| Persistent| Current website/session
Auth| Configure separately| Existing site session
Site context| Must recreate| Exact page/user state
Distribution| One integration per service| Publisher adds WebMCP
Best use| Headless/repeated automation| Help while visiting site

Do NOT claim WebMCP universally replaces MCP.

---

60. REAL WORLD VISION

README/submission should say:

Imagine every:

Ashby board
Greenhouse board
Lever board
Workday careers portal
company careers page
university portal
event site
marketplace
support portal

exposed its own semantic capabilities.

Users should not need to install hundreds of connectors.

The open web itself becomes discoverable.

This demo represents one employer site.

---

61. WHY NOT SCRAPING / PLAYWRIGHT

This is a key pitch.

DOM automation must infer:

which card is a job
which text is compensation
which button means Save
which route represents application
which state belongs to current candidate

The website already knows all of that.

WebMCP lets it declare those concepts explicitly.

Semantic tools are:

- more reliable
- structured
- bounded
- permission-aware
- not dependent on CSS selectors
- easier for site owner to maintain

---

62. SECURITY STORY

The agent gets no secret credentials.

It receives the capabilities appropriate to the website's current user.

Mutation operations use the same permission checks/session as human UI.

If signed out:

search/get job

may work.

But:

save
apply
application tools

return:

AUTH_REQUIRED

Do not create a secret WebMCP bypass.

---

63. README STRUCTURE

Create strong README:

# Careers WebMCP

> The careers page is the connector.

[demo gif/video]

## What it is

## Why this is WebMCP

## The open-web thesis

## Demo

## WebMCP tools

## Human + agent flow

## Architecture

## Security

## Existing project / challenge delta

## Running locally

## Testing

## Limitations

## License / upstream attribution

---

64. README OPENING DRAFT

Use something close to:

# Careers WebMCP

> The careers page is the connector.

Careers WebMCP demonstrates what agent-native destination websites can look
like.

The underlying application is a normal careers portal: humans can search
jobs, inspect openings, save roles, and manage applications without an AI
model or agent.

When WebMCP is available, the same page exposes those concepts semantically
to the browser agent already accompanying the user.

No careers-specific MCP server.
No bearer token.
No DOM scraping.
No AI SDK.

Visit the site, and the site explains itself.

---

65. UPSTREAM ATTRIBUTION

Keep upstream MIT license obligations.

README:

Based on Baalvion Jobs Portal (MIT)

with link.

"NOTICE" or "UPSTREAM.md" should state:

Original project:
Baalvion Jobs Portal

License:
MIT

Challenge work:
WebMCP semantic integration, context/session bridge, deterministic semantic
job search, shared candidate operations, testing, demo data, documentation.

Do not obscure provenance.

---

66. SUBMISSION POSITIONING

Prepare:

docs/submission.md

---

67. WEBMCP LEVERAGE

Draft:

«Careers WebMCP treats the website itself as the integration boundary. The browser agent discovers semantic job, navigation, saved-role, and application tools directly from the employer site the user is currently visiting. Those tools operate using the page's current authenticated candidate session and current application state, eliminating DOM scraping and per-site connector installation.»

---

68. EXECUTION

Mention:

- normal complete careers UI
- shared service/domain state
- semantic structured search
- live route context
- signed-in candidate session
- shared saved jobs
- shared application drafts
- stale revision protection
- WebMCP annotations
- structured errors
- bounded outputs
- integration tests
- public deployment

---

69. IMPACT

Draft:

«There are countless employer portals, school portals, support sites, marketplaces, and other destination websites that users visit occasionally but would never configure as permanent MCP integrations. Publisher-provided WebMCP turns each page into a temporary semantic interface automatically available while the user is there.»

This project uses careers as a concrete example of the broader agent-native web.

---

70. CREATIVITY / AMBITION

Do NOT pitch job search itself as novel.

Pitch distribution architecture:

website owns semantics
browser agent discovers them on arrival

The web becomes its own integration registry.

---

71. KNOWN LIMITATIONS

Be explicit:

- fictional deterministic job catalog
- demo candidate session
- no real employer submission
- no resume upload through WebMCP v1
- no demographic fields
- no job recommendation AI
- no cross-employer aggregation
- browser requires WebMCP support

This is a protocol demo, not production ATS software.

---

72. DO NOT BUILD

Do not add:

- resume parser
- resume upload through agent
- cover-letter generation
- AI matching
- scraping external job sites
- LinkedIn integration
- Greenhouse API
- Ashby API
- Lever API
- email
- calendar
- recruiter AI
- ATS dashboard improvements
- company creation
- analytics
- interview scheduling
- admin WebMCP
- job-post creation tools
- cross-company search
- user social features
- chat UI
- agent activity sidebar

None are needed.

---

73. SCOPE IS CANDIDATE-SIDE ONLY

WebMCP challenge surface should be candidate-facing.

Do NOT expose admin/recruiter functionality.

That keeps tool set coherent:

discover
inspect
navigate
save
apply
manage my applications

---

74. OPTIONAL V2 TOOL

Only after everything works:

careers_focus_application_field

Maybe:

careers_set_search_view

which synchronizes a structured query into visible UI filters.

But do not delay submission.

---

75. DEVELOPMENT ORDER

Follow exactly.

Phase 0

Vendor contract.

Record upstream.

Phase 1

Run untouched upstream.

Phase 2

Two Haiku scouts.

Phase 3

Enable deterministic mock/demo mode.

Do not add WebMCP until normal app works.

Phase 4

Seed final jobs/candidate/application data.

Phase 5

Create semantic adapter using existing service/domain functions.

Phase 6

Implement read-only WebMCP first:

get_context
search_jobs
get_job
open_job

Make browser tests pass.

Phase 7

Saved jobs.

Phase 8

Application read/start/update.

Phase 9

Revision/stale protection.

Phase 10

Submission.

Phase 11

Security/bounds/annotations.

Phase 12

Docs/deployment.

Phase 13

Audit.

---

76. PARALLEL SONNET OWNERSHIP

After scouts and baseline:

Sonnet A

Own:

semantic job search
job normalization
job seed data
search tests

Do not edit WebMCP registration.

Sonnet B

Own:

WebMCP registration
schemas
results/errors
context
navigation tools
WebMCP shim/unit tests

Sonnet C

Own:

candidate saved jobs
applications
shared draft state
revision safety
application tests

Lead owns:

integration
UI seams
CI
deployment
docs
demo

Avoid overlapping files.

If repo architecture makes that division awkward:

lead creates interface boundaries before workers start.

---

77. FINAL HAIKU AUDIT

Run one cheap auditor only.

Prompt:

«Audit repository against docs/BUILD_CONTRACT.md.

Do not suggest new features.

Find concrete blockers only.

Prioritize:

1. WebMCP API correctness
2. normal site broken without WebMCP
3. DOM scraping instead of semantic service access
4. current route/session mismatch
5. saved jobs disconnected between UI/WebMCP
6. application state disconnected between UI/WebMCP
7. stale application overwrite
8. auth secret leakage
9. missing untrusted-content annotations
10. output bounding
11. build/test/deployment blockers
12. challenge delta/provenance

For every finding provide:

severity
exact file
failed contract section
smallest fix

Do not redesign architecture.

If there are no blockers, say so.»

One Sonnet fixer for confirmed findings only.

---

78. ACCEPTANCE CRITERIA — NORMAL APP

Without WebMCP:

- jobs list works
- job detail works
- search/filter UI works
- demo sign-in works
- Save works
- application start works
- application form works
- drafts persist
- application submission works
- application list/status works

No AI required.

---

79. ACCEPTANCE CRITERIA — WEBMCP

Required:

careers_get_context
careers_search_jobs
careers_get_job
careers_open_job
careers_get_saved_jobs
careers_set_saved_job
careers_get_my_applications
careers_get_application
careers_start_application
careers_update_application
careers_submit_application

All register through current:

document.modelContext.registerTool

---

80. ACCEPTANCE CRITERIA — SHARED STATE

Required:

route

Human opens job.

Agent context sees job.

Agent opens job.

Human sees normal page.

save

Human saves.

Agent sees saved.

Agent unsaves/saves.

Human UI updates.

application

Agent starts draft.

Human sees form.

Agent updates.

Human sees field updates.

Human edits.

Agent reads human edit.

Old revision mutation is rejected.

CRITICAL.

---

81. ACCEPTANCE CRITERIA — SECURITY

No:

password
cookie value
token
JWT
Firebase credential

appears in WebMCP results.

Signed-out mutations rejected.

Job/user prose marked untrusted where appropriate.

---

82. ACCEPTANCE CRITERIA — TESTS

At minimum:

search filter tests
context tests
saved state tests
application revision tests
WebMCP registration tests
Playwright shared-route test
Playwright shared-save test
Playwright application co-edit test
no-WebMCP test
auth-required test
secret leakage regression test

---

83. ACCEPTANCE CRITERIA — PUBLIC SUBMISSION

- public HTTPS deployment
- public repo
- open source license
- upstream attribution
- challenge delta
- README
- tool docs
- demo script
- no secrets
- build passes
- tests pass

---

84. GOLDEN PRODUCT INTERACTION

Optimize for this:

HUMAN
visits normal careers website
signs in

        ↓

AGENT
“Find staff+ engineering roles in SF or remote,
base starting above $220k.”

        ↓

SITE
semantic search tool returns exact structured openings

        ↓

AGENT
opens Staff Platform Engineer

        ↓

HUMAN
reads normal job page
clicks Save manually

        ↓

AGENT
immediately sees it in saved jobs
starts application

        ↓

NORMAL APPLICATION PAGE
opens

        ↓

AGENT
fills part of draft

        ↓

HUMAN
manually changes cover note

        ↓

AGENT
continues from new revision
without overwriting human text

That is the submission.

---

85. THE POINT

The novelty is not:

AI can apply to jobs

The point is:

ordinary websites can advertise their semantics directly to visiting agents

The careers site is merely the concrete demonstration.

Humans still use the website.

The website still exists independently.

The user does not install anything for this employer.

The browser agent does not scrape the DOM.

The website already knows what a job, saved role, application, and signed-in candidate are.

WebMCP lets it say so.

---

86. FINAL COPY

Headline:

«The careers page is the connector.»

Description:

«Careers WebMCP extends a normal job portal with semantic WebMCP tools for job discovery, navigation, saved roles, and candidate applications. The tools operate against the same live website state and signed-in candidate session the human is already using—without an AI SDK, MCP server, copied credentials, or DOM scraping.»

Vision:

«You shouldn't install an integration for every website you visit. The website should explain itself to your agent.»

---

87. STOP CONDITION

Once:

normal app works
WebMCP tools work
human/agent state is shared
stale application writes are safe
tests pass
public deployment works
README/demo/submission are complete
audit finds no blocker

STOP.

Do not spend remaining tokens polishing upstream admin pages.

Do not add another feature.

Do not rebuild the careers app.

Ship.
