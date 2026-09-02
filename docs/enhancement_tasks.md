# Baalvion Job Portal: Post-Completion Enhancements

This document outlines a series of actionable enhancement tasks for the completed job portal. Each task is categorized and includes a priority, description, and suggested implementation approach, ready for development within Firebase Studio.

---

## 1. UX / Frontend Improvements

### Task: Implement Subtle Page Transitions
- **Module / Feature**: UX / Frontend
- **Priority**: `Low`
- **Description**: Add subtle fade-in animations on page load to create a smoother, more polished user experience when navigating between pages.
- **Suggested Implementation Approach**:
  1. Install `framer-motion`.
  2. In the root layouts (`src/app/(public)/layout.tsx` and `src/app/(admin)/layout.tsx`), wrap the `children` prop in a `motion.div`.
  3. Apply `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`, and `transition={{ duration: 0.5 }}` props to the `motion.div` to achieve the fade-in effect.
- **Status**: `Pending`

### Task: Add Loading Skeletons to Public Pages
- **Module / Feature**: UX / Frontend
- **Priority**: `High`
- **Description**: The admin panel uses loading skeletons effectively. The public-facing job detail and country pages should also have them to improve perceived performance during static generation fallback or revalidation.
- **Suggested Implementation Approach**:
  1. Create a new `loading.tsx` file inside `src/app/(public)/careers/countries/[slug]/jobs/[jobId]`.
  2. Inside this file, build a skeleton layout using the existing `Skeleton` component (`@/components/ui/skeleton`) that mimics the structure of the job detail page (header, main content, sidebar).
  3. Repeat this process for the country page at `src/app/(public)/careers/countries/[slug]/loading.tsx`.
- **Status**: `Pending`

---

## 2. Notifications

### Task: Implement Real Email Notifications
- **Module / Feature**: Notifications
- **Priority**: `Medium`
- **Description**: The current system uses a mock email service that logs to the console. This should be replaced with a real transactional email provider (e.g., SendGrid, Resend) to send actual emails to candidates.
- **Suggested Implementation Approach**:
  1. Create a new service, e.g., `src/services/email.service.ts`.
  2. This service should use an SDK (like `resend-node`) to send emails. The API key should be stored in environment variables.
  3. Create backend API endpoints (e.g., `/api/send-email`) that use this service.
  4. Replace the `console.log` logic in files like `src/lib/notifications/emailMock.ts` with calls to these new API endpoints.
- **Status**: `Pending`

### Task: Real-time Admin Notifications for New Applications
- **Module / Feature**: Notifications / Admin Dashboard
- **Priority**: `High`
- **Description**: When a candidate successfully applies, a real-time notification should appear for logged-in admins/recruiters without needing a page refresh.
- **Suggested Implementation Approach**:
  1. The project already has a mock real-time service (`socket.engine`) and a `NotificationProvider`.
  2. In the API route that handles application submission (`src/app/api/[country]/application/route.ts`), after successfully creating the application, emit a `NEW_APPLICATION` event via the socket engine.
  3. The `NotificationProvider` in the frontend will receive this event and automatically trigger a toast notification for all connected admin users.
- **Status**: `Completed`

---

## 3. Analytics / Reporting

### Task: Add Granular Application Trend Charts
- **Module / Feature**: Analytics / Reporting
- **Priority**: `Medium`
- **Description**: Enhance the Analytics dashboard by adding new charts that show application trends broken down by country and by department over the selected time range.
- **Suggested Implementation Approach**:
  1. In `src/modules/analytics/services/analytics.mock.ts`, expand the `generateAnalyticsData` function to group application data by country and department.
  2. Create new chart components (e.g., `ApplicationsByCountryChart.tsx` and `ApplicationsByDeptChart.tsx`) using the existing `recharts` and `ChartContainer` components.
  3. Add these new chart components to the `src/app/(admin)/analytics/page.tsx` dashboard grid.
- **Status**: `Pending`

---

## 4. Integrations

### Task: Implement Calendar Integration for Interview Scheduling
- **Module / Feature**: Integrations / Interviews
- **Priority**: `Medium`
- **Description**: Integrate with an external calendar service (e.g., Google Calendar) to automatically create calendar events when an interview is scheduled in the admin panel.
- **Suggested Implementation Approach**:
  1. Use the `googleapis` library.
  2. In the backend, create a service that handles OAuth 2.0 authentication for Google Calendar access.
  3. When an interview is scheduled via `interview.service.ts`, trigger a backend API call.
  4. This API call will use the calendar service to create a new event, add the candidate and interviewers as attendees, and include the meeting link in the event description.
- **Status**: `Pending`

---

## 5. Performance / Optimization

### Task: Implement Advanced Image Optimization
- **Module / Feature**: Performance / Optimization
- **Priority**: `Medium`
- **Description**: Ensure all images served via `next/image` are maximally optimized by enabling modern formats like AVIF, which offer better compression than WebP.
- **Suggested Implementation Approach**:
  1. Modify the `next.config.js` file.
  2. In the `images` configuration object, add the `formats` property: `formats: ['image/avif', 'image/webp']`. Next.js will automatically serve the best format supported by the user's browser.
- **Status**: `Completed`

---

## 6. Compliance / Legal

### Task: Enhance Audit Trail for Sensitive Data Access
- **Module / Feature**: Compliance / Legal
- **Priority**: `High`
- **Description**: The current audit log tracks entity changes. Expand this to also record when sensitive candidate data (like profiles or documents) is viewed by an admin or recruiter.
- **Suggested Implementation Approach**:
  1. In `src/services/candidate.service.ts`, locate the `getCandidateProfile` function.
  2. After a profile is successfully fetched, make a call to the `auditService` to log a new event.
  3. The event payload should include `actionType: 'CANDIDATE_PROFILE_VIEWED'`, the `actorId` (the logged-in user's ID), and the `entityId` (the candidate's ID being viewed).
- **Status**: `Pending`

---

## 7. Optional Features

### Task: Implement "Recently Viewed Jobs"
- **Module / Feature**: Optional Features / UX
- **Priority**: `Medium`
- **Description**: Track the jobs a user views and display a "Recently Viewed" list, for example on the main `/careers/open-positions` page. This enhances user convenience and re-engagement.
- **Suggested Implementation Approach**:
  1. On the job detail page (`/careers/countries/[slug]/jobs/[jobId]/page.tsx`), use a client-side `useEffect` hook.
  2. Inside the effect, get the current list of viewed job IDs from `localStorage`.
  3. Add the current `jobId` to the list (avoiding duplicates) and trim the list to a reasonable number (e.g., 5).
  4. Save the updated list back to `localStorage`.
  5. Create a new component, `RecentlyViewedJobs.tsx`, that reads these IDs from `localStorage`, fetches the corresponding job details, and displays them. Add this component to the `open-positions` page.
- **Status**: `Pending`
