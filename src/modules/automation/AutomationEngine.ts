
import { Job } from '@/lib/talent-acquisition';
import { Application } from '@/types';
import { AutomationResult } from './types';
import { runAutoExpireRule } from './rules/autoExpireRule';
import { runScheduledPublishRule } from './rules/scheduledPublishRule';
import { runSlaEscalationRule } from './rules/slaEscalationRule';
import { runAutoCloseRule } from './rules/autoCloseRule';
import { runApplicationStatusRule } from './rules/applicationStatusRule';

export class AutomationEngine {
  public run(jobs: Job[], applications: Application[]): AutomationResult {
    const result: AutomationResult = {
      updatedJobs: [],
      updatedApplications: [],
      notifications: [],
      escalations: [],
      logs: [],
    };

    // Rule 1: Scheduled Publishing
    const publishResult = runScheduledPublishRule([...jobs]);
    result.logs.push(...publishResult.logs);
    result.notifications.push(...publishResult.notifications);
    this.mergeJobUpdates(result.updatedJobs, publishResult.updatedJobs);

    // Apply updates from previous rule before running next
    let currentJobs = this.applyUpdates(jobs, result.updatedJobs);

    // Rule 2: Auto Expiry
    const expireResult = runAutoExpireRule(currentJobs);
    result.logs.push(...expireResult.logs);
    result.notifications.push(...expireResult.notifications);
    this.mergeJobUpdates(result.updatedJobs, expireResult.updatedJobs);
    currentJobs = this.applyUpdates(jobs, result.updatedJobs);

    // Rule 3: Auto Close on Applicant Threshold
    const autoCloseResult = runAutoCloseRule(currentJobs);
    result.logs.push(...autoCloseResult.logs);
    result.notifications.push(...autoCloseResult.notifications);
    this.mergeJobUpdates(result.updatedJobs, autoCloseResult.updatedJobs);
    currentJobs = this.applyUpdates(jobs, result.updatedJobs);

    // Rule 4: SLA Escalations
    const slaResult = runSlaEscalationRule(currentJobs);
    result.logs.push(...slaResult.logs);
    result.notifications.push(...slaResult.notifications);
    result.escalations.push(...slaResult.escalations);
    // This rule doesn't update jobs, so no need to re-apply

    // Rule 5: Application Status Automation (runs on jobs updated in THIS cycle)
    const appStatusResult = runApplicationStatusRule(result.updatedJobs, applications);
    result.logs.push(...appStatusResult.logs);
    this.mergeApplicationUpdates(result.updatedApplications, appStatusResult.updatedApplications);

    return result;
  }

  // Helper to merge job updates, ensuring one job is only updated once per run
  private mergeJobUpdates(main: Job[], updates: Job[]) {
    updates.forEach(updatedJob => {
      const index = main.findIndex(j => j.id === updatedJob.id);
      if (index > -1) {
        main[index] = updatedJob;
      } else {
        main.push(updatedJob);
      }
    });
  }

   // Helper to merge application updates
  private mergeApplicationUpdates(main: Application[], updates: Application[]) {
    updates.forEach(updatedApp => {
      const index = main.findIndex(a => a.id === updatedApp.id);
      if (index > -1) {
        main[index] = updatedApp;
      } else {
        main.push(updatedApp);
      }
    });
  }
  
  // Helper to get the latest state of jobs after a rule runs
  private applyUpdates(originalJobs: Job[], updatedJobs: Job[]): Job[] {
      const updatedJobMap = new Map(updatedJobs.map(j => [j.id, j]));
      return originalJobs.map(job => updatedJobMap.get(job.id) || job);
  }
}
