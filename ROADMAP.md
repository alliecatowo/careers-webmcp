# Project Roadmap

This document outlines the future direction and planned features for the Baalvion Jobs Portal.

---

## Q3 2024: Production Readiness & Core Backend

-   [ ] **Firebase Backend Implementation**:
    -   [ ] Migrate all mock services to live Firestore collections.
    -   [ ] Implement Firebase Authentication for user login and registration.
    -   [ ] Set up Firebase Storage for resume and document uploads.
-   [ ] **Real-time Notifications**:
    -   [ ] Integrate a WebSocket service (e.g., Socket.IO on Cloud Run) to replace the mock socket engine.
    -   [ ] Implement push notifications for key events.
-   [ ] **Transactional Emails**:
    -   [ ] Replace the mock email service with a real provider (e.g., SendGrid, Resend) for all candidate and admin communications.
-   [ ] **CI/CD Pipeline**:
    -   [ ] Enhance the CI workflow with automated testing (Jest, React Testing Library).
    -   [ ] Create a CD workflow for automated deployments to Firebase App Hosting.

---

## Q4 2024: AI & Automation Enhancements

-   [ ] **Live AI Integration**:
    -   [ ] Connect the AI flows (resume parsing, candidate scoring) to live Genkit/Vertex AI models.
    -   [ ] Implement a background processing pipeline using Cloud Functions for asynchronous resume analysis.
-   [ ] **Automation Engine**:
    -   [ ] Deploy the automation rules (e.g., auto-expire jobs, SLA escalations) as scheduled Cloud Functions.
-   [ ] **Advanced Analytics**:
    -   [ ] Implement aggregation functions for the analytics dashboard to provide deeper insights into hiring trends and pipeline health.

---

## 2025: Platform Expansion

-   [ ] **Employer/Client Self-Service**:
    -   [ ] Build a dedicated portal for employer clients to self-manage job postings, view candidates, and manage billing.
-   [ ] **Multi-Language Support (i18n)**:
    -   [ ] Internationalize the application to support multiple languages for global users.
-   [ ] **Advanced ATS Integrations**:
    -   [ ] Build out real integrations with leading ATS providers like Greenhouse and Lever, moving beyond the current mock setup.
-   [ ] **Payment & Payout Integration**:
    -   [ ] Integrate with Stripe Connect or a similar service to handle payouts to candidates/contractors.

---

## Future Vision

-   **Mobile Application**: Develop native mobile apps for iOS and Android.
-   **Community Features**: Build features for candidates to network, share knowledge, and form teams.
-   **Gamification**: Introduce leaderboards and badges to incentivize platform engagement.
