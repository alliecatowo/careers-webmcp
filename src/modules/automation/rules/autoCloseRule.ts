
import { Job } from '@/lib/talent-acquisition';
import { AutomationAuditLog, AutomationNotification } from '../types';
import { notificationService } from '../notifications/NotificationService';

const APPLICANT_THRESHOLD = 200;

export function runAutoCloseRule(jobs: Job[]): { updatedJobs: Job[], logs: AutomationAuditLog[], notifications: AutomationNotification[] } {
  const updatedJobs: Job[] = [];
  const logs: AutomationAuditLog[] = [];
  const notifications: AutomationNotification[] = [];
  const now = new Date();

  jobs.forEach(job => {
    if (job.status === 'published' && (job.applicants || 0) >= APPLICANT_THRESHOLD) {
      const updatedJob = { ...job, status: 'closed' as const };
      updatedJobs.push(updatedJob);

      logs.push({
        id: `log-autoclose-${Date.now()}`,
        entityId: job.id,
        entityType: 'job',
        action: 'AUTO_CLOSE_APPLICANT_THRESHOLD',
        previousValue: 'published',
        newValue: 'closed',
        timestamp: now,
        triggeredBy: 'AutomationEngine',
      });
      
      notifications.push(notificationService.sendStatusChangeNotification(job, 'closed (Applicant limit reached)'));
    }
  });

  return { updatedJobs, logs, notifications };
}
