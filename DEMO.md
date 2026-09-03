# DEMO.md — video production playbook

Everything needed to record and cut the demo video. Follow it top to bottom and
the video makes itself.

| | |
| --- | --- |
| **Target runtime** | **2:45** (hard cap 2:59 — the rules say "less than three minutes") |
| **Target narration** | **355 spoken words** (~2.3 words/sec, leaving real silence for the UI beats) |
| **Audio** | Voiceover required by the rules. No music. No third-party trademarks on screen. |
| **Resolution** | 1920×1080, browser window ≥1440px wide, zoom 100% |
| **Upload** | Public YouTube (not unlisted) |

The narration must, **on the audio track**, cover: what was built, the problem,
why WebMCP matters, and how WebMCP was implemented. Each is tagged in the
storyboard. On-screen text does not satisfy these — the rules require audio.

**The one idea the video has to land:** every other way an agent helps you on a
website works by *copying your authority to the agent*. WebMCP lets the
publisher decide what's delegable. Clips B, E and G are that idea; everything
else is setup and payoff. If you cut for time, cut anything but those three.

---

## Exact starting application state

Before **every** recording session:

1. Open `https://careers-webmcp.vercel.app/careers/open-positions`.
2. DevTools → Application → Storage → **Clear site data** (localStorage +
   sessionStorage). Reload.
3. Confirm: header shows **Continue as Avery Chen** (i.e. you are **signed
   out**), no saved jobs, no applications, and **no presence UI at all** — no
   pill, no scan bar. If any presence chrome is visible before a tool runs,
   that's a bug; reload.
4. Agent side panel open, **new empty conversation**.
5. Browser zoom 100%, window ≥1440px, nothing else in the tab strip, no
   bookmarks bar, no notifications.
6. **The page must be visible the whole time, next to the agent panel.** In an
   acceptance run the browser was hidden while tools ran, and the entire
   search-typing beat was invisible — the tools worked and the reviewer saw
   nothing. Side-by-side, page dominant. If your agent client hides the page
   while it works, record the page window and the agent panel together rather
   than trusting the client's own layout.

The demo deliberately opens **signed out** — the account hand-off in Clip E is
the centre of the video and only works from a signed-out start.

**Rehearsal note:** the agent picks its own tools. The prompts below are
written so the obvious tool is the right one. Never say tool names out loud —
let the presence pills do that work.

---

## Storyboard

| Time | Clip | Screen | Narration covers |
| --- | --- | --- | --- |
| 0:00–0:05 | Title | Card 1 | — |
| 0:05–0:24 | A | Careers site, human browsing | **PROBLEM** |
| 0:24–0:52 | B | Agent compound search | **WHY WEBMCP** + **HOW IMPLEMENTED** |
| 0:52–1:06 | C | Search applied to the real page | **WHAT WAS BUILT** |
| 1:06–1:18 | D | Human saves, agent sees it | **HOW IMPLEMENTED** |
| 1:18–1:48 | E | Account hand-off | **PROBLEM** + **WHY WEBMCP** |
| 1:48–2:12 | F | Co-editing one application draft | **WHAT WAS BUILT** |
| 2:12–2:25 | G | Submit hand-off | **WHY WEBMCP** |
| 2:25–2:45 | H | Close over the jobs list | thesis |

---

## Title cards

**Card 1** — 0:00–0:05, black background, white text, centred:

```
Careers WebMCP
The careers page is the connector.
```

**Card 2** — optional 0.6s flash over the cut into Clip E, only if the beat
needs room to breathe:

```
The agent fills the form.
The human presses the button.
```

No other cards. The audio carries everything the rules require.

---

## Clip A — "it's just a careers site" (0:05–0:24, ~19s)

**Why this shot exists:** establishes that the product is complete and useful
with no agent present. Every later claim depends on the audience believing this
is a real site, not an AI demo shell. It also plants the account wall that
Clip E pays off.

**DO (human, no agent):**
1. Slow scroll down the job list on `/careers/open-positions` (~3s).
2. Click **Staff Platform Engineer**. Let level, workplace and compensation
   render (~3s).
3. Browser back to the list.

**Agent prompts:** none. Do not open the agent panel yet.
**Expected tool calls:** none. **Zero presence UI must appear.**

**SAY:**

> "This is a careers site. Twenty open roles. There's no AI anywhere in this
> page — you can search it, read a job, save one, apply. It works exactly like
> every careers site you've ever bounced off. Including the part where applying
> starts with 'create an account.'"

**Cut/zoom:** Static full-window. No zoom. Straight cut into Clip B.

---

## Clip B — the compound search (0:24–0:52, ~28s)

**Why this shot exists:** the WebMCP argument, stated as an inversion rather
than a convenience. It's also where the audio explains the implementation.

**DO:**
1. Open the agent side panel.
2. Type verbatim:

**"I'm on this careers site. Find me engineering roles at staff level or above, in San Francisco or remote, paying at least $220k base."**

3. Hold on the page while it runs.

**Expected tool calls:** `careers_search_jobs`
**Expected visible result:** the scan bar crosses the top of the page; one pill
reads *Searching jobs · 6 matches*; the agent's reply lists the roles with
level, location and compensation.

**SAY:**

> "I never installed a connector for this site. I never pasted a key. Normally
> an agent helps here by taking my whole session and guessing at the markup.
> This one didn't have to — the page handed it eighteen tools on
> document-dot-model-context, and every one of them calls the same functions
> the site's own buttons call."

**Cut/zoom:** Slow push-in to 1.15× on the pill as it appears (~1s ease), hold,
ease back out. Straight cut to Clip C.

---

## Clip C — the search runs on the real page (0:52–1:06, ~14s)

**Why this shot exists:** the most convincing frame in the video. The agent
isn't summarising in a side panel; it's driving the actual site.

**DO:** If the agent didn't already do it, type verbatim:

**"Show me that search on the page."**

**Expected tool calls:** `careers_set_search_view`
**Expected visible result:** the site's own search box types the query
**character by character**; the visible filter chips light up; the job list
narrows to the same matches the agent just described.

**SAY:**

> "So the answer lands on the page. That's the site's own search box, typing.
> Those are my filters — the same search function underneath, not a copy."

**Cut/zoom:** Zoom 1.3× on the search box for the typing animation. **Do not
cut mid-type** — the character-by-character fill is the shot. Ease out to full
window as the list settles.

---

## Clip D — a human click the agent can see (1:06–1:18, ~12s)

**Why this shot exists:** proves shared state in the cheapest possible way, and
sets up the co-edit in Clip F.

**DO:**
1. Header → **Continue as Avery Chen**.
2. Click into **Staff Platform Engineer** and click **Save job** yourself.
3. Type verbatim: **"What have I saved?"**

**Expected tool calls:** `careers_get_saved_jobs`
**Expected visible result:** pill reads *Checking saved jobs · 1 saved job*;
the agent names the role you just saved.

**SAY:**

> "I saved that with my own hand, and it sees it. Same store the button writes
> to. One state, not two."

**Cut/zoom:** Static. Straight cut.

---

## Clip E — the account hand-off (1:18–1:48, ~30s)

**Why this shot exists:** the beat that lands with an audience. It shows the
real problem being solved *and* the publisher-enforced limit, in one continuous
take. **Protect this clip above all others.**

**DO:**
1. Sign out (header menu) so the sign-up flow is available. *(If you started
   this clip fresh you're already signed out — skip.)*
2. Type verbatim:

**"I want to apply. Set me up an account — my full name is Sam Rivera, my email is sam.rivera@example.test, my phone is +1 555 0100, I'm based in Austin, about six years experience."**

3. Watch the sign-up page open, already filled, fields flashing. **Hold. Don't
   click yet.**
4. Move the cursor onto the pulsing **Create account** button and hover — don't
   click for a full beat.
5. Click **Create account** yourself.

**Say every field out loud in the prompt — full name, email, phone.** Browser
agents have their own safety layer that refuses to submit personal details it
inferred rather than was given; an acceptance run hit exactly that when the
name was implied. This is not the site validating, and it is not recoverable on
camera. Spell it out.

**Expected tool calls:** `careers_create_account`, returning
`status: "awaiting_human_confirmation"`
**Expected visible result:** `/careers/signup` opens with name, email, location
and experience filled and flashing; the **Create account** button carries the
hand-off cue; the pill reads *ready for you to confirm*. Nothing is created
until your click.

**SAY:**

> "Every one of us has bounced off an application because it started with
> 'create an account.' So it just did that part — name, email, location,
> experience, from what I told it.
>
> But it didn't press the button. It can't. There's exactly one function on
> this site that creates an account, and only this button calls it. That's not
> a missing feature. The publisher decides what an agent is allowed to finish."

**Cut/zoom:** Zoom 1.25× on the form as the fields flash. Hold on the hovering
cursor over **Create account** for a deliberate beat before the click. Ease out
after.

---

## Clip F — co-editing one application draft (1:48–2:12, ~24s)

**Why this shot exists:** the technically strongest claim — agent and human
writing into the same draft with the human's edits structurally protected.

**DO:**
1. Type verbatim: **"Great — apply to the Staff Platform Engineer role for me."**
   Watch the job page open, then the application form, prefilled from the new
   profile.
2. **Type your own cover note by hand** into the cover-note field while the
   agent is idle. Enough to be visibly yours (~1 line). Narrate it.
3. Type verbatim:

**"Keep what I wrote and fill in whatever's still missing. My phone is +1 555 0100 and I can start in two weeks."**

**Expected tool calls:** `careers_start_application`, then
`careers_get_application` (returns the new revision), then
`careers_update_application` carrying `expectedRevision` matching what it just
read.
**Expected visible result:** the phone and availability fields flash as they
fill; the pill reads *2 fields filled*. **The cover note is untouched.**

**SAY:**

> "I'll write my own cover note. By hand, straight into the form.
>
> Now watch — it re-read the draft first, saw my edit, and filled only the
> empty fields. Every write carries the revision it last read, so a stale one
> gets rejected. My words always win."

**Cut/zoom:** Zoom 1.2× on the form fields for the flash. Keep the cover note
in frame the whole time so the audience can see it never changes.

---

## Clip G — the submit hand-off (2:12–2:25, ~13s)

**Why this shot exists:** closes the authority argument symmetrically with
Clip E. Two irreversible actions, both ending at a human finger.

**DO:**
1. Type verbatim: **"Is it ready to send?"**
2. Watch the page scroll to **Submit Application** and ring it.
3. Click **Submit Application** yourself.

**Expected tool calls:** `careers_submit_application`, returning
`status: "awaiting_human_confirmation"`
**Expected visible result:** the page scrolls to the Submit button, ringed in
amber; the pill reads *waiting for you*; the confirmation appears only after
your click.

**SAY:**

> "Same rule at the end. It ran every check the form runs, and stopped. The
> last irreversible click is mine."

**Cut/zoom:** Follow the scroll, zoom 1.3× on the ringed Submit button, hold on
the cursor for a beat, click, ease out.

---

## Clip H — close (2:25–2:45, ~20s)

**Why this shot exists:** converts one careers site into the general argument.

**DO:** Browser back to `/careers/open-positions`. Let the full job list sit on
screen, no agent activity, until the audio ends.

**Agent prompts:** none.

**SAY:**

> "No MCP server. No connector I installed, no token I pasted, no scraping. A
> normal careers site that explains itself to whatever agent walks in with me —
> and decides for itself where that agent stops.
>
> Now imagine every job board, every portal you'd never configure an
> integration for. The website should be the connector."

**Cut/zoom:** Slow pull-back from 1.1× to full window across the whole clip.
Fade to black on the final word.

---

## Optional cutaway — exports (only if you land under 2:30)

**Why:** the "it didn't read twenty job descriptions" moment surprises
technical viewers. **Cut this first if you're over time.** ~15s.

**DO:** From the jobs list, type verbatim:

**"Pull every open role and tell me which team has the widest pay bands."**

Click the **Download** chip when it appears.

**Expected tool calls:** `careers_create_export`, then `careers_read_export`
**Expected visible result:** pill reads *Preparing an export · 20 rows ready*;
a **Download** chip appears; clicking it opens the real export view.

**SAY:**

> "It didn't read twenty job descriptions to answer that. The site handed it a
> CSV and a handle, and it pulled two columns out. And I get the same file."

Insert between Clip G and Clip H.

---

## Reset between clips

Each clip is **independently recordable**. To re-record one, restore its entry
state:

| Re-recording | Reset to |
| --- | --- |
| A, B, C | Clear site data → reload → **signed out**, new agent conversation |
| D | Clear site data → reload → sign in with **Continue as Avery Chen** → new agent conversation |
| E | Clear site data → reload → **signed out** (critical) → new agent conversation |
| F | Clear site data → run Clip E once so the account exists → new agent conversation |
| G | As F, with the application draft filled but **not** submitted |
| H | Any state; just be on `/careers/open-positions` with no agent activity |
| Exports cutaway | Any state; be on `/careers/open-positions` |

"Clear site data" = DevTools → Application → Storage → Clear site data, then
reload. Always start a **new** agent conversation — a warm thread changes which
tools the agent picks.

---

## If something goes sideways on camera

- **The agent describes results instead of touching the page.** Say "show me on the page" — that maps to `careers_set_search_view`. If it still won't, keep going; the structured result is still the point.
- **The agent tries to press Submit or Create account.** It can't, and it will say so. That's a *good* take — say "and it can't, that's the point" and click it yourself.
- **No pills, nothing registers.** The agent isn't seeing `document.modelContext`. Reload the tab. Worth saying out loud that the site keeps working either way.
- **A tool errors.** The pill turns red and the agent gets a structured code (`AUTH_REQUIRED`, `STALE_APPLICATION`, `VALIDATION_ERROR`), not a stack trace — and the codes carry enough detail for it to recover in one turn. Read it out loud; recovering live is more convincing than a clean take.

---

## Recording without a WebMCP-capable browser

Fallback only; a real agent is far better on camera. Drive the tools with the
test shim in `tests/webmcp-shim.ts`:

```bash
pnpm test:e2e --headed tests/e2e/presence.spec.ts
```

Or inject the shim from a DevTools snippet and call
`window.__webmcp.call(name, input)` by hand. The presence UI behaves
identically, so every visual beat above still lands — but you'll have to
narrate around the missing agent panel.

---

## Full narration script (record straight through)

> This is a careers site. Twenty open roles. There's no AI anywhere in this
> page — you can search it, read a job, save one, apply. It works exactly like
> every careers site you've ever bounced off. Including the part where applying
> starts with "create an account."
>
> I never installed a connector for this site. I never pasted a key. Normally
> an agent helps here by taking my whole session and guessing at the markup.
> This one didn't have to — the page handed it eighteen tools on
> document-dot-model-context, and every one of them calls the same functions
> the site's own buttons call.
>
> So the answer lands on the page. That's the site's own search box, typing.
> Those are my filters — the same search function underneath, not a copy.
>
> I saved that with my own hand, and it sees it. Same store the button writes
> to. One state, not two.
>
> Every one of us has bounced off an application because it started with
> "create an account." So it just did that part — name, email, location,
> experience, from what I told it.
>
> But it didn't press the button. It can't. There's exactly one function on
> this site that creates an account, and only this button calls it. That's not
> a missing feature. The publisher decides what an agent is allowed to finish.
>
> I'll write my own cover note. By hand, straight into the form.
>
> Now watch — it re-read the draft first, saw my edit, and filled only the
> empty fields. Every write carries the revision it last read, so a stale one
> gets rejected. My words always win.
>
> Same rule at the end. It ran every check the form runs, and stopped. The last
> irreversible click is mine.
>
> No MCP server. No connector I installed, no token I pasted, no scraping. A
> normal careers site that explains itself to whatever agent walks in with me —
> and decides for itself where that agent stops.
>
> Now imagine every job board, every portal you'd never configure an
> integration for. The website should be the connector.

---

## YouTube

**Title:**

```
Careers WebMCP — the careers page is the connector (OpenAI WebMCP Challenge)
```

**Description:**

```
A normal careers site that hands its own capabilities to whatever browser agent
arrives with the visitor. No connector to install, no API key, no MCP server,
no DOM scraping, no AI SDK in the page.

Built for the OpenAI WebMCP Challenge.

Live demo: https://careers-webmcp.vercel.app/careers/open-positions
Code: https://github.com/alliecatowo/careers-webmcp

Every other way an agent helps you on a website works by copying your authority
to the agent — a scraper takes your whole session and guesses at markup, a
connector takes a token you pasted and acts out of sight of the page. WebMCP
inverts that: the publisher defines the capabilities, so the publisher defines
the limits.

The site registers 18 candidate-facing tools on document.modelContext —
semantic job search, navigation, control of the site's own search view, saved
jobs, application drafts, field focus, account sign-up and bulk CSV export.
Nothing reads the DOM. The human UI and the tools import the same domain
functions, so the page and the agent can't disagree about state, and the pages
publish their own context rather than being scraped.

Two tools deliberately never complete. careers_create_account fills the real
sign-up form; careers_submit_application runs the same validation gate the
human Submit button runs and highlights it. Both return
status: "awaiting_human_confirmation". There's no confirm:true escape hatch
because there's no second code path — the WebMCP layer never imports the
function that submits an application or the one that creates a session, and
each has exactly one caller in the whole codebase, both inside a human-clicked
button.

Application drafts carry a monotonic revision. Every agent write carries the
revision it last read, so a stale write is rejected and the human's text always
survives.

Bulk data is exposed as a handle rather than rows: a WebMCP result is a plain
value with no streaming, so the site builds a real CSV and the agent pages
through it with column projection. The human downloads the same file.

Built on the MIT-licensed Baalvion Jobs Portal. The WebMCP layer, agent
presence layer, context bridge, semantic search, candidate session, saved jobs,
revision-protected drafts, sign-up hand-off, exports, tests and docs are the
challenge-period contribution.

Chapters:
0:00 A normal careers site
0:24 One question, no connector installed
0:52 The agent drives the real search box
1:06 A human click the agent can see
1:18 The account hand-off
1:48 Co-editing one application draft
2:12 The agent stops at Submit
2:25 Every site should be its own connector

MIT licensed.
```

**Visibility:** Public. Not unlisted — the rules require publicly visible.

---

## Thumbnail

**Copy (two lines, large, high contrast, upper-left third):**

```
THE AGENT FILLS THE FORM.
YOU PRESS THE BUTTON.
```

**Exact screenshot to use:** the frame from **Clip E** at the moment the
sign-up form is filled and the **Create account** button is pulsing with the
hand-off cue, cursor hovering over it, before the click. Crop to the form and
the button at ~1.25× so the filled fields are readable. That single frame
states the whole thesis without audio.

Fallback if that frame is unusable: the Clip C frame with the query half-typed
into the site's own search box and the presence pill visible.
