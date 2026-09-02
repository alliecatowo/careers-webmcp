
export const employmentTypes = ["Full-time", "Part-time", "Contract", "Internship", "Temporary"] as const;
export type EmploymentType = typeof employmentTypes[number];

export const experienceBands = ["Intern", "Entry", "Mid", "Senior", "Lead", "Principal"] as const;
export type ExperienceBand = typeof experienceBands[number];

export const workforceTypes = ["Onsite", "Hybrid", "Remote"] as const;
export type WorkforceType = typeof workforceTypes[number];

export const jobStatuses = ["draft", "internal-review", "compliance-review", "approved", "scheduled", "published", "paused", "closed", "archived"] as const;
export type JobStatus = typeof jobStatuses[number];

export const salaryVisibilities = ["Public", "RangeOnly", "Hidden"] as const;
export type SalaryVisibility = typeof salaryVisibilities[number];

export interface ApprovalChain {
  hiringManagerId: string;
  recruiterId: string;
  complianceOfficerId: string;
  approvedAt: string; // ISO Date String
}

export interface PublishSchedule {
  publishAt: string; // ISO Date String
  closeAt: string; // ISO Date String
}


// Roles defined for the workflow engine
export type WorkflowActorRole =
  | 'admin'
  | 'recruiter'
  | 'hiring-manager'
  | 'compliance-officer'
  | 'country-hr'
  | 'system'; // For automated transitions

// Data structure for an entry in the workflow audit trail
export interface WorkflowAuditEntry {
  previousStatus: JobStatus;
  newStatus: JobStatus;
  changedBy: string; // actorId
  actorRole: WorkflowActorRole;
  changedAt: string; // ISO Date String
  comment?: string;
}

// Input for requesting a state transition
export interface WorkflowTransitionRequest {
  jobId: string;
  currentStatus: JobStatus;
  targetStatus: JobStatus;
  actorId: string;
  actorRole: WorkflowActorRole;
  comment?: string;
}

// Output from a state transition attempt
export interface WorkflowTransitionResult {
  success: boolean;
  newStatus: JobStatus;
  timestamp: string; // ISO Date String
  error?: WorkflowError;
}

// Structured error for workflow operations
export interface WorkflowError {
  code: 'JOB_NOT_FOUND' | 'STATUS_MISMATCH' | 'INVALID_TRANSITION' | 'UNAUTHORIZED_ROLE' | 'SCHEDULE_INVALID';
  message: string;
}
