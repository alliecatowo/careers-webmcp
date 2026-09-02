import { Job } from '@/lib/talent-acquisition';
import {
  WorkflowError,
  JobStatus,
  WorkflowActorRole,
} from '@/types/workflow.types';
import {
  WORKFLOW_TRANSITIONS,
  TRANSITION_PERMISSIONS,
} from '@/constants/workflow.constants';

/**
 * Creates a structured workflow error object.
 */
export function createWorkflowError(
  code: WorkflowError['code'],
  message: string,
): WorkflowError {
  return { code, message };
}

/**
 * Validates if a job's schedule is valid for a "scheduled" transition.
 * @param job The job object.
 * @throws {WorkflowError} If the schedule is invalid.
 */
export function validateSchedule(job: Job): void {
  if (!job.publishSchedule?.publishAt) {
    throw createWorkflowError(
      'SCHEDULE_INVALID',
      'Job must have a scheduled publish date to be moved to "scheduled" status.',
    );
  }
  if (new Date(job.publishSchedule.publishAt) <= new Date()) {
    throw createWorkflowError(
      'SCHEDULE_INVALID',
      'Scheduled publish date must be in the future.',
    );
  }
}

/**
 * Checks if a status transition is allowed based on the defined workflow map.
 */
export function isTransitionAllowed(from: JobStatus, to: JobStatus): boolean {
  return WORKFLOW_TRANSITIONS[from]?.includes(to) || false;
}

/**
 * Checks if a user role is authorized to perform a specific status transition.
 */
export function isRoleAuthorized(
  from: JobStatus,
  to: JobStatus,
  role: WorkflowActorRole,
): boolean {
  const transitionKey = `${from}_${to}`;
  const allowedRoles = TRANSITION_PERMISSIONS[transitionKey];
  return allowedRoles?.includes(role) || false;
}
