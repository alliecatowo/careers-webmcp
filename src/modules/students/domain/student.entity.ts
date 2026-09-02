
export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  collegeId: string;
  course: string;
  graduationYear: number;
  isPlaced: boolean;
  documents?: {
    offerLetterUrl?: string;
    idProofUrl?: string;
  };
  // Unified optional fields
  degree?: string;
  cgpa?: number;
  status?: "pending" | "approved" | "rejected";
  verified?: boolean;
  aiScore?: number | null;
  collegeType?: string;
  company?: string;
  role?: string;
}
