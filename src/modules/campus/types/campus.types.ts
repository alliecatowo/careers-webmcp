export interface ApplicationMatch {
  id: string; // applicationId
  studentId: string;
  studentName: string;
  jobId: string;
  jobTitle: string;
  score: number;
  status: 'Applied' | 'Interview' | 'Placed' | 'Rejected';
}
