
import { UserRole } from "@/lib/access/access.types";

export const MOCK_ROLES: Record<UserRole, { description: string }> = {
  SUPER_ADMIN: {
    description: "Has unrestricted access to the entire platform and all tenant data.",
  },
  ADMIN: {
    description: "Manages users, billing, and settings within their own tenant.",
  },
  RECRUITER: {
    description: "Manages candidates and the hiring pipeline for assigned jobs within their tenant.",
  },
  INTERVIEWER: {
    description: "Can view candidate profiles and submit feedback for interviews they are assigned to.",
  },
  FINANCE: {
    description: "Can view and approve salary and offer details.",
  },
  CANDIDATE: {
    description: "Can apply for jobs and track their own application status.",
  },
  CLIENT: {
    description: "Can create projects and manage their own projects.",
  },
  CONTRACTOR: {
    description: "Can apply to projects and complete assigned work.",
  },
};
