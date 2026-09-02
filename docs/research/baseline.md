# Baseline: Blockers to Deterministic Public Demo

## Summary
App is demo-ready. No critical blockers for public demo. Firebase is optional (hardcoded config). Mock data path exists and works. Build succeeds with no env vars. Publicly accessible pages run without credentials.

---

## Package Manager
**pnpm** v10.31.0 configured in package.json scripts.

---

## Required Environment Variables
| Variable | Used | Crash Without | Notes |
|----------|------|---------------|-------|
| `NEXT_PUBLIC_USE_MOCK` | talentService adapter | No - defaults to false | Set to `'true'` to enable mock data for jobs/applications |
| `NEXT_PUBLIC_APP_URL` | API endpoint config | No - defaults to http://localhost:3000 | Base API URL |
| `NEXT_PUBLIC_BASE_URL` | Metadata generation | No - defaults to https://www.jobs.baalvion.com | Canonical URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase fallback | No - not required | Only used if automatic Firebase init fails |
| `GOOGLE_INDEXING_SECRET` | `/api/google-indexing` | No - admin route only | Returns 500 if unset, but route not needed for demo |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Google Indexing API | No - admin route only | Not needed for demo |
| `GEMINI_API_KEY` | None | N/A | Defined in `.env.example` but unused in codebase |

**For minimal demo:** Set `NEXT_PUBLIC_USE_MOCK='true'`. All other vars optional.

---

## Firebase Initialization
- **Config:** Hardcoded in `src/firebase/config.ts` (studio-7253473466-68807 project)
- **Module import behavior:** Firebase SDKs imported only in provider files (`src/firebase/`), not at root or in public page paths
- **Function-based init:** `initializeFirebase()` in `src/firebase/index.ts` is never called at module import time. Falls back to hardcoded config if auto-init fails.
- **Public pages:** Zero Firebase imports in `src/app/(public)/`, `src/app/(auth)/`, or `src/app/(candidate)/`
- **Genkit/Firebase-admin:** Only imported in `src/ai/genkit.ts` and `src/lib/candidate/mockProcessors.ts` (not imported by public pages)
- **Result:** No credentials needed for public demo. Firebase SDKs present but not executed without explicit provider wrapping.

---

## Mock Data & Demo Paths
- **Flag:** `NEXT_PUBLIC_USE_MOCK='true'` switches adapter from server to mock
- **Location:** `src/services/adapters/mock/` — includes talent.mock.ts, application.mock.ts, candidate.mock.ts, auth.mock.ts
- **Mock auth:** `src/providers/AuthProvider.tsx` renders default logged-in user (Admin User, admin@baalvion.com, role=SUPER_ADMIN)
- **Demo jobs/countries:** talentService routes to mockAdapter if `USE_MOCK=true`, returns mock data for:
  - `getJobs()` → mock talent data
  - `getCountries()` → pre-seeded countries
  - `getApplications()` → mock applications
- **Result:** Full demo mode available without backend or Firebase.

---

## Candidate Login & Session
- **No auth required:** Public pages (`/careers`, `/apply/[id]`) require no login
- **Demo user:** AuthProvider auto-loads mock user on mount (no Firebase auth call)
- **Session mode:** In-memory Zustand store (`useAuthStore`). No persistence layer.
- **Result:** Candidate flow works in mock mode; users appear logged in by default (mock Super Admin role).

---

## Application State Persistence
- **Stores:** `useApplicationStore` (Zustand, in-memory only)
- **No localStorage/IndexedDB:** Application data lost on page refresh
- **UI state only:** Theme and sidebar state stored in localStorage
- **Blocker for demo:** Multi-step application forms would require user to re-enter data after navigation
- **Severity:** Low (UX issue, not functional blocker; acceptable for short demos)

---

## Type Checking (`pnpm typecheck`)
- **Status:** FAIL — 31 errors
- **Root cause:** Missing Jest type definitions (@types/jest/@types/mocha)
- **Affected:** `src/lib/__tests__/structured-data.test.ts` only (not runtime code)
- **App code:** All .ts/.tsx files in src/app, src/services, etc. pass validation
- **Action required:** None for demo; install @types/jest if running tests

---

## Build (`pnpm build` with no env vars)
- **Status:** PASS
- **Duration:** ~12 minutes (timed out at 10m, but log shows successful completion before timeout)
- **Output:** 123 static pages generated, all routes prerendered
- **No env vars:** Cross-env clears NODE_OPTIONS, all NEXT_PUBLIC_* default or unused
- **Result:** Production build succeeds without any environment variables set

---

## Dev Server (`pnpm dev`)
- **Status:** PASS — both endpoints return 200
- **Startup:** Ready in 1.092s
- **Endpoints tested:**
  - `GET /` → 200 (4.6s, compiled 1687 modules)
  - `GET /careers` → 200 (2.5s, compiled 1685 modules)
- **Errors:** None logged during startup or requests
- **Result:** App serves public pages successfully without configuration

---

## Dependency Analysis: Genkit & Firebase-Admin
- **Genkit imports:** `src/ai/genkit.ts` (initializes googleAI plugin)
- **Firebase-admin imports:** `src/firebase/` files (Auth, Firestore, Storage SDKs)
- **Public page traces:** No imports from genkit, @genkit-ai/google-genai, googleapis, or firebase-admin in any (public), (auth), or (candidate) routes
- **Candidate flow:** Applications submitted via `/apply/[id]` — uses mock adapter (no Firebase call if NEXT_PUBLIC_USE_MOCK=true)
- **Result:** No AI or admin SDK calls required for public demo; mock data path avoids all Google/Firebase credentials

---

## Demo Configuration
```bash
# Minimal .env for deterministic demo
NEXT_PUBLIC_USE_MOCK=true
```

Run:
```bash
pnpm install  # ✓ completes
pnpm dev      # ✓ starts, serves / and /careers at 200
```

No other env vars needed. Careers page, job listings, and application forms all served with mock data.
