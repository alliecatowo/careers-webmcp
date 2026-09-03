# Demo script

You are driving a real WebMCP-capable agent (Codex) against the deployed site,
talking over a screen recording. Everything below in `>` is what you say.
Everything in **bold quotes** is what you type to the agent, verbatim.

Target length: **3 minutes.** There is a 90-second cut at the end if you need it.

---

## Before you hit record

- [ ] Deployed site open at `/careers/open-positions`
- [ ] **Signed out.** Clear site data (localStorage + sessionStorage) — the demo
      opens with no account, which is the whole point of Scene 3.
- [ ] Agent side panel open, no prior conversation in the thread
- [ ] Browser zoom 100%, window ≥ 1440px wide so the job cards don't wrap
- [ ] Nothing else in the tab strip

One rehearsal note: the agent picks its own tools. The prompts below are written
so the obvious tool is the right one, but don't read the tool names out loud in
the narration — let the pills on screen do that work.

---

## Scene 1 — It's just a careers site (20s)

Don't mention agents. Don't mention WebMCP. Scroll the job list, click into
**Staff Platform Engineer**, let the compensation and level render.

> "This is a careers site. Twenty open roles. You can search it, read a job,
> save one, apply — all of it works, and there is no AI anywhere in this page.
> Hold that thought."

Go back to the jobs list.

---

## Scene 2 — Ask the agent something the site was never built to answer (35s)

Type:

**"I'm on this careers site. Find me engineering roles at staff level or above,
in San Francisco or remote, paying at least $220k base."**

Watch the scan bar cross the top of the page and the pill read *Searching jobs ·
6 matches*.

> "I never installed a careers connector. I never gave it an API key. It just
> found the site's own job search, because the page hands its capabilities to
> whatever agent shows up."

Then, without a new prompt if the agent does it on its own — otherwise type:

**"Show me that search on the page."**

The search box types itself. The list narrows.

> "And look — it's not describing the results to me in a chat window. It's
> driving the actual site. That's my search box. Those are my filters."

---

## Scene 3 — The account (40s)

This is the beat. Slow down here.

Type:

**"I want to apply. Set me up an account — I'm Sam Rivera, sam.rivera@example.test,
based in Austin, about six years experience."**

The sign-up page opens, already filled.

> "Every one of us has bounced off a job application because it started with
> 'create an account'. So it just... did that. Name, email, location, experience."

Point at the **Create account** button, which is pulsing.

> "But it didn't press the button. It can't. The site will not create a session
> from a tool call — the agent fills the form, and the person confirms it. That's
> not a limitation I ran out of time to fix, it's the design."

Click **Create account** yourself.

> "Now I have an account, and the agent knows I have one, because it's reading
> the same session the page is."

---

## Scene 4 — Apply for me (45s)

Type:

**"Great — apply to the Staff Platform Engineer role for me."**

The job opens, then the application form, prefilled from the new profile.

Now type your own cover note into the form, by hand, while the agent is idle.
Say what you're doing:

> "I'm going to write my own cover note here. Human edit, straight into the form."

Then type:

**"Keep what I wrote and fill in whatever's still missing. My phone is
+1 555 0100 and I can start in two weeks."**

The phone and availability fields flash blue as they fill. The cover note is
untouched.

> "It re-read the draft first, saw my edit, and wrote only the empty fields.
> Every write carries the revision it last read — if I'd typed while it was
> thinking, the write gets rejected and it has to look again. My edits win."

---

## Scene 5 — The hand-off (20s)

Type:

**"Is it ready to send?"**

The page scrolls to the Submit button and rings it in amber. The pill reads
*Your application is complete and ready to send. Your move.*

> "Same rule as the account. It checked everything the form checks, and then it
> stopped. The last irreversible click is mine."

Click **Submit Application**.

---

## Scene 6 — The one that surprises people (20s)

Optional but strong if you have the time. Go back to open positions and type:

**"Pull every open role and tell me which team has the widest pay bands."**

The pill reads *Preparing an export · 20 rows ready*, and a **Download** chip
appears.

> "It didn't read twenty job descriptions into its context to answer that. The
> site gave it a CSV and a handle, and it pulled two columns out of it. And I get
> the same file — that's a real download, not something it made up."

Click **Download** to show the export page.

---

## Close (15s)

> "There's no MCP server behind this. No connector I installed, no token I
> pasted, no scraping. It's a normal careers site that happens to explain itself
> to whatever agent walks in with the user.
>
> Now imagine every Greenhouse board, every Workday portal, every DMV site you
> visit twice a year and would never configure an integration for.
>
> You shouldn't have to install something for every website you visit. The
> website should be the connector."

---

## The 90-second cut

If you only have 90 seconds: **Scene 1** (10s, no click-through) → **Scene 2**
(25s, search only, skip "show me on the page") → **Scene 3** (30s, the account) →
**Scene 5** (15s, hand-off) → **Close** (10s).

Cut Scene 4's co-editing and Scene 6's export. The account beat is the one that
lands with an audience; protect it.

---

## If something goes sideways on camera

**The agent describes results instead of touching the page.** Say "show me on the
page" — that maps to `careers_set_search_view`. If it still doesn't, keep going;
the search result itself is the point.

**The agent tries to press Submit or Create account.** It can't, and it will tell
you so. This is a good moment, not a bad one — say "and it can't, that's the
point" and click it yourself.

**Nothing registers / no pills appear.** The agent isn't seeing
`document.modelContext`. Reload the tab. Note that the site keeps working
perfectly either way — worth saying out loud if it happens.

**A tool errors.** The pill goes red and the agent gets a structured code
(`AUTH_REQUIRED`, `STALE_APPLICATION`, `VALIDATION_ERROR`), not a stack trace.
Read the error out loud; recovering from it live is more convincing than a clean
take.

---

## Recording without a WebMCP-capable browser

The whole flow is driven by the test shim in `tests/webmcp-shim.ts`:

```bash
pnpm test:e2e --headed tests/e2e/presence.spec.ts
```

Or inject the shim via a DevTools snippet and drive tools by hand from the
console with `window.__webmcp.call(name, input)`.
