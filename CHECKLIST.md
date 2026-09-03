# CHECKLIST.md

**What do I personally still have to do before this entry is safely submitted?**

⏰ **Devpost submission closes 2026-09-03 at 13:00 PT.**

## Project

- [ ] Open the live demo in a **real WebMCP-capable browser** (ChatGPT in-app browser, or Chrome with WebMCP enabled) and confirm all 16 tools register and are callable. Everything so far was verified via the test shim and Playwright — no human has confirmed a real agent end to end.
- [ ] Walk the 9 judge-testing steps in `SUBMISSION.md` §6 against the live URL and confirm each one behaves as written.
- [ ] Confirm the deployed build matches `HEAD` (redeploy with `npx vercel deploy --prod --yes` if not).

## Repository

- [ ] Set the GitHub repo **homepage** field to `https://careers-webmcp.vercel.app/careers/open-positions` (currently empty).
- [ ] Add GitHub topics: `webmcp`, `model-context-protocol`, `nextjs`, `agentic-web`.
- [ ] Confirm the About sidebar on github.com shows **MIT License**.
- [ ] Commit and push these doc changes.

## Demo recording

- [ ] Set the exact starting state from `DEMO.md` § "Exact starting application state".
- [ ] Record Clip A — careers site, no agent (~19s).
- [ ] Record Clip B — compound search (~28s).
- [ ] Record Clip C — search typed into the site's own box (~14s).
- [ ] Record Clip D — human save, agent sees it (~12s).
- [ ] Record Clip E — account hand-off (~30s). **Protect this take.**
- [ ] Record Clip F — co-editing one draft (~24s).
- [ ] Record Clip G — submit hand-off (~13s).
- [ ] Record Clip H — close (~20s).
- [ ] Optional: record the exports cutaway (~15s) — only if the cut lands under 2:30.

## Video production

- [ ] Record the voiceover from `DEMO.md` § "Full narration script" (355 words).
- [ ] Assemble in storyboard order with the specified zooms and cuts.
- [ ] Build Title Card 1 (and Card 2 if the Clip E cut needs it).
- [ ] **Verify final runtime is under 2:59.** The rules say "less than three (3) minutes" — a 3:00 file risks disqualification.
- [ ] Confirm no music, no third-party trademarks, no real people's photos on screen.
- [ ] Confirm the audio explicitly covers: what was built, the problem, why WebMCP matters, how WebMCP was implemented.

## YouTube

- [ ] Upload with the exact title from `DEMO.md` § YouTube.
- [ ] Paste the exact description from `DEMO.md` § YouTube.
- [ ] Set visibility to **Public** (not unlisted).
- [ ] Upload the thumbnail (Clip E frame; copy in `DEMO.md` § Thumbnail).
- [ ] Confirm chapter timestamps in the description match the final cut.
- [ ] Watch the published video once, signed out, in an incognito window.
- [ ] Record the YouTube URL into `SUBMISSION.md` §4.

## Devpost

- [ ] Register for the hackathon at https://webmcp.devpost.com/ if not already registered.
- [ ] Project name: `Careers WebMCP`
- [ ] Tagline: `The careers page is the connector.`
- [ ] Paste the description from `SUBMISSION.md` §5.
- [ ] Live URL: `https://careers-webmcp.vercel.app/careers/open-positions`
- [ ] Repo URL: `https://github.com/alliecatowo/careers-webmcp`
- [ ] YouTube URL.
- [ ] Testing instructions from `SUBMISSION.md` §6 (state clearly: no credentials needed).
- [ ] Built-with tags from `SUBMISSION.md` §4.
- [ ] Upload gallery images from `docs/media/` (lead with `01-jobs-index.png`).
- [ ] Answer the existing-project disclosure using `SUBMISSION.md` §8.
- [ ] **Click Submit.** Saving a draft is not submitting.

## Final verification

- [ ] Record the final submitted commit SHA in `SUBMISSION.md` §9.
- [ ] Open the live URL in a private window with no extensions — confirm it loads anonymously and shows zero agent UI.
- [ ] Open the repo signed out — confirm README renders and the MIT license shows.
- [ ] Open the YouTube link signed out — confirm it plays.
- [ ] Re-open the Devpost submission after submitting and confirm every field saved.
