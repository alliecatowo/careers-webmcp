# App map (Scout A, 2026-09-02) — canonical seams WebMCP must reuse

## Routes
- Jobs index: `/careers/open-positions` → `src/app/(public)/careers/open-positions/page.tsx` → `GlobalJobListing` (`src/modules/talent-acquisition/components/GlobalJobListing.tsx`, client, SWR, URL params `q,countryId,departmentId,employmentType,page`, 5/page)
- Careers landing: `/careers` → `src/app/(public)/careers/careers-landing.tsx` (server)
- Job detail: `/careers/countries/[slug]/jobs/[jobId]` → `src/app/(public)/careers/countries/[slug]/jobs/[jobId]/page.tsx` (server component; `talentService.getJobById`, `getCountryBySlug`, `getDepartments`, `getComplianceProfile`); legacy `/job/[id]` redirects
- Application: `/careers/application/[slug]?jobId=` phases 1–3 + `/success?appId=` → `src/app/(public)/careers/application/[slug]/{page,phase2/page,phase3/page,success/page}.tsx` (client, react-hook-form + zod)
- Candidate: `/my-account` (`src/app/(candidate)/my-account/page.tsx`), `/my-account/applications/[id]`

## Services / adapters
- `src/services/talent.service.ts` → `talentService.{getCountries,getCountryBySlug,getCountryById,getDepartments,getJobs(filters)→PaginatedResponse<Job>,getJobById,getComplianceProfile}`
- `src/services/adapter.ts` switches on `NEXT_PUBLIC_USE_MOCK=true` → `src/services/adapters/mock/talent.mock.ts` (in-memory filters, 50–350ms fake latency) vs `adapters/server/talent.server.ts` (fetches `/api/*`)
- `src/services/application.service.ts` → `submitMultiPhaseApplication(countrySlug, data)` POST `/api/[country]/application`; `getApplicationsForUser(userId)`
- Mock data: `src/mocks/talent-platform/{jobs,countries,departments,compliance,applications,roles}.mock.ts`

## Types
- `Job`: `src/lib/talent-acquisition/types/job.ts` — id, requisitionCode, title, countryId, city, state?, departmentId, employmentType, experienceBand, workforceType, salaryBand?, currency?, salaryVisibility, equityEligible, relocationSupport, visaSponsorship, status, visibility, description, responsibilities[], qualifications[], publishStartDate?, publishEndDate?, createdAt, updatedAt, remoteAllowed?, seniorityLevel?, requiredSkills?
- Application zod schema: `src/types/application.types.ts` (`multiPhaseApplicationSchema`: fullName,email,phone,preferredWorkModel,linkedinUrl,portfolioUrl,resume,coverLetter,... phase2 skills, phase3 documents incl. nationalId/taxId — NOT to be exposed via WebMCP)
- `User`: `src/types/contracts.ts` (id,name,fullName,email,role,...)

## Session
- Zustand `src/store/auth.store.ts` (`user,isLoading,setUser,setRole`); `src/hooks/useAuth.ts` mock login by email→role; `src/app/providers/AuthProvider.tsx` sets a mock ADMIN user on mount (must become: signed-out by default + "Continue as demo candidate")

## Application draft state
- Zustand `src/store/application.store.ts` (`applicationData`, in-memory only, no persistence, no revision)

## Saved jobs
- None upstream → implement small candidate feature (localStorage-persisted zustand store).

## AI
- `src/ai/*` (genkit) used only by `src/app/(admin)/campus/ai-matching`; not on public/candidate paths.

## Providers
- `src/app/layout.tsx` → `src/app/providers/AppProvider.tsx` (ErrorBoundary>Theme>UI>Request>Toast>Auth). Scout flagged a stray placeholder in root layout body — verify.
