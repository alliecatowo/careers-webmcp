# Upstream provenance

| Field | Value |
| --- | --- |
| Original project | Baalvion Jobs Portal ("TalentOS by Baalvion") |
| Upstream repository | https://github.com/baalvionservice/Baalvion-Jobs-Portal |
| Upstream commit imported | 9108409d4844b7ba90367da79fd2fed5040f5b61 |
| Upstream commit date | 2026-04-14 |
| Date cloned | 2026-09-02 |
| License of the imported commit | MIT, declared in the upstream README at that commit ("MIT License / Copyright (c) Baalvion"; the repo had no separate LICENSE file) |

## Why this commit and not upstream HEAD

The build contract assumed an MIT-licensed upstream. On 2026-06-02 upstream
added a proprietary LICENSE file (commit `a14cffd`, "chore: add proprietary
license") while its README still said MIT. Commits after `9108409` only add
that LICENSE, README screenshots, break the root layout, and delete photos of
real people. None of them touch application source.

This repository is therefore based on `9108409`, the last commit published
under the MIT declaration. The MIT grant for that version is irrevocable; the
later relicensing applies to later versions. Source files were verified to be
identical between `9108409` and the later HEAD except `src/app/layout.tsx`.

## Exclusions from the import

- `public/photos/*` (photographs of identifiable people) were not imported.
- Upstream's `.github/preview.png` screenshot was not imported.

## Branding

The visible employer/product name was changed from "Baalvion" / "TalentOS" to
the fictional "Northwind" / "Northwind Careers" throughout the UI and demo
data, so this demo does not trade on upstream's name. "Baalvion" appears only
in attribution.

## Challenge work

WebMCP semantic integration, context/session bridge, deterministic semantic
job search, shared candidate operations (saved jobs, application drafts with
revision protection), testing, demo data, documentation.

See docs/CHALLENGE_DELTA.md for the full separation.
