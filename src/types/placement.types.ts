
import { Student } from "@/modules/students/domain/student.entity";

export interface College {
  id: string;
  name: string;
  type: "1" | "2" | "3"; // Type 1,2,3
  verified: boolean;
}

// Re-export the unified Student type
export type { Student };

export interface Placement {
  id: string;
  studentId: string;
  companyName: string;
  role: string;
  approved: boolean; // Admin-approved
  createdAt: string;
  verifiedByAdminId: string;
  auditLogs?: {
    action: "approved" | "rejected" | "document_verified";
    adminId: string;
    timestamp: string;
    notes?: string;
  }[];
}
