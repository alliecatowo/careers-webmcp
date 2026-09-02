# **App Name**: TalentOS

## Core Features:

- Multi-Tenant Data Isolation: All collections must include tenantId. Enforce isolation via Firestore security rules. No cross-tenant querying allowed. All API routes validate tenantId from token + API key. Explicitly document security rule strategy.
- White-Label Configuration: Each tenant can customize Logo, Primary/Secondary theme, Domain (careers.company.com), and Email templates. Branding must load dynamically per tenant. No hardcoded values.
- API-First Backend with Rate Limiting: All actions via Cloud Functions. Validate API key, tenantId, role, and rate limit. Document rate limiting logic structure. Include API key rotation strategy.
- Asynchronous Resume Processing: Upload to Tenant-Isolated Storage Path, trigger Cloud Function, extract text, perform External AI Scoring, and Store Structured Result. Must use async queue approach. UI must never block. AI result stored under tenant-scoped path. Structure output consistently. This structured data becomes a tool for the LLM.
- Role-Based Access Control: Roles: Owner, Admin, Recruiter, Viewer. Enforce RBAC at Frontend rendering layer, Backend API validation, and Firestore rules.
- Comprehensive Audit Logging: Log API calls, admin actions, permission changes, and authentication events. Centralized logging strategy required.
- Real-Time Analytics Dashboard: Indexed queries only. Pagination required. No large collection scans. Scheduled aggregation if needed. Performance-safe design.

## Style Guidelines:

- Primary Color: Deep Purple (#6750A4)
- Background: Light Purple (#F2EFF7, 20% desaturation)
- Accent: Blue (#5B84C2)
- Font: Inter (sans-serif)
- Icons: Material Design Icons
- Clean enterprise structure, Consistent spacing, Clear information hierarchy
- Subtle transitions only, Professional tone (no flashy startup design)