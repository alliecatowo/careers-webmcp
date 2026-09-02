import { jobService } from './job.service';
import {
  WorkflowTransitionRequest,
  WorkflowTransitionResult,
  WorkflowAuditEntry,
  WorkflowError
} from '@/types/workflow.types';
import {
  createWorkflowError,
  isTransitionAllowed,
  isRoleAuthorized,
  validateSchedule,
} from '@/utils/workflow.util';

const workflowService = {

  /**
   * Attempts to transition a job from its current status to a new one.
   * Enforces all workflow, role, and data validation rules.
   */
  async transition(request: WorkflowTransitionRequest): Promise<WorkflowTransitionResult> {
    try {
      const job = await jobService.getById(request.jobId);

      // 1. Fetch and validate job
      if (!job) {
        throw createWorkflowError('JOB_NOT_FOUND', `Job with ID ${request.jobId} not found.`);
      }
      if (job.status !== request.currentStatus) {
        throw createWorkflowError(
          'STATUS_MISMATCH',
          `Job status is "${job.status}", but request expected "${request.currentStatus}".`
        );
      }

      // 2. Validate transition and authorization
      if (!isTransitionAllowed(request.currentStatus, request.targetStatus)) {
        throw createWorkflowError(
          'INVALID_TRANSITION',
          `Transition from "${request.currentStatus}" to "${request.targetStatus}" is not allowed.`
        );
      }
      if (!isRoleAuthorized(request.currentStatus, request.targetStatus, request.actorRole)) {
        throw createWorkflowError(
          'UNAUTHORIZED_ROLE',
          `Role "${request.actorRole}" is not authorized to transition from "${request.currentStatus}" to "${request.targetStatus}".`
        );
      }

      // 3. Validate schedule if applicable
      if (request.targetStatus === 'scheduled') {
        validateSchedule(job);
      }

      // 4. Prepare audit log
      const auditEntry: WorkflowAuditEntry = {
        previousStatus: job.status,
        newStatus: request.targetStatus,
        changedBy: request.actorId,
        actorRole: request.actorRole,
        changedAt: new Date().toISOString(),
        comment: request.comment,
      };

      const updatedHistory = [...(job.workflowHistory || []), auditEntry];

      // 5. Update job via jobService
      const updatedJob = await jobService.update(job.id, {
        status: request.targetStatus,
        workflowHistory: updatedHistory,
        audit: { // Pass actorId to be recorded in the main audit object
            ...job.audit,
            updatedBy: request.actorId,
        }
      });
      
      if (!updatedJob) {
           throw createWorkflowError('JOB_NOT_FOUND', `Job with ID ${request.jobId} could not be updated.`);
      }

      // 6. Return success
      return {
        success: true,
        newStatus: updatedJob.status,
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      return {
        success: false,
        newStatus: request.currentStatus,
        timestamp: new Date().toISOString(),
        error: error as WorkflowError,
      };
    }
  },

  /**
   * Simulates a cron job to auto-publish scheduled jobs.
   */
  async checkAndAutoPublish(): Promise<void> {
    const allJobs = await jobService.getAll();
    const jobsToPublish = allJobs.filter(job => 
        job.status === 'scheduled' && 
        job.publishSchedule?.publishAt &&
        new Date(job.publishSchedule.publishAt) <= new Date()
    );

    for (const job of jobsToPublish) {
      console.log(`Auto-publishing job: ${job.id} - ${job.title}`);
      await this.transition({
        jobId: job.id,
        currentStatus: 'scheduled',
        targetStatus: 'published',
        actorId: 'system-cron',
        actorRole: 'system',
        comment: 'Automatic transition from scheduled to published.',
      });
    }
  }
};

export { workflowService };
