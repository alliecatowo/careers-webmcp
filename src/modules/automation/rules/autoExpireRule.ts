
import { Job } from '@/lib/talent-acquisition';
import { AutomationAuditLog, AutomationNotification } from '../types';
import { notificationService } from '../notifications/NotificationService';

export function runAutoExpireRule(jobs: Job[]): { updatedJobs: Job[], logs: AutomationAuditLog[], notifications: AutomationNotification[] } {
  const updatedJobs: Job[] = [];
  const logs: AutomationAuditLog[] = [];
  const notifications: AutomationNotification[] = [];
  const now = new Date();

  jobs.forEach(job => {
    if (job.status === 'published' && job.publishEndDate && new Date(job.publishEndDate) < now) {
      const updatedJob = { ...job, status: 'closed' as const };
      updatedJobs.push(updatedJob);

      logs.push({
        id: `log-${Date.now()}`,
        entityId: job.id,
        entityType: 'job',
        action: 'AUTO_EXPIRE_STATUS_CHANGE',
        previousValue: 'published',
        newValue: 'closed',
        timestamp: now,
        triggeredBy: 'AutomationEngine',
      });
      
      notifications.push(notificationService.sendStatusChangeNotification(job, 'closed (Expired)'));
    }
  });

  return { updatedJobs, logs, notifications };
}
