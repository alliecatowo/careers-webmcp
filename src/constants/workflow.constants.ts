import { JobStatus, WorkflowActorRole } from '@/types/workflow.types';

// Defines the allowed transitions from one status to another.
export const WORKFLOW_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  draft: ['internal-review'],
  'internal-review': ['compliance-review', 'draft'],
  'compliance-review': ['approved', 'draft'],
  approved: ['scheduled', 'published'],
  scheduled: ['published'],
  published: ['paused', 'closed'],
  paused: ['published', 'closed'],
  closed: ['archived'],
  archived: [],
};

// Defines which roles can perform a specific transition.
// The key is a string concatenation of "from_to".
export const TRANSITION_PERMISSIONS: Record<string, WorkflowActorRole[]> = {
  'draft_internal-review': ['recruiter', 'admin'],
  'internal-review_compliance-review': ['hiring-manager', 'admin'],
  'internal-review_draft': ['recruiter', 'admin'], // Allowing moving back
  'compliance-review_approved': ['compliance-officer', 'admin'],
  'compliance-review_draft': ['hiring-manager', 'admin'], // Allowing moving back
  'approved_published': ['recruiter', 'admin'],
  'approved_scheduled': ['recruiter', 'admin'],
  'scheduled_published': ['system', 'admin'], // Primarily automated, but admin can trigger
  'published_paused': ['recruiter', 'admin'],
  'published_closed': ['recruiter', 'admin'],
  'paused_published': ['recruiter', 'admin'],
  'paused_closed': ['recruiter', 'admin'],
  'closed_archived': ['admin'],
};
