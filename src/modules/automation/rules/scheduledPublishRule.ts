
import { Job } from '@/lib/talent-acquisition';
import { AutomationAuditLog, AutomationNotification } from '../types';
import { notificationService } from '../notifications/NotificationService';

export function runScheduledPublishRule(jobs: Job[]): { updatedJobs: Job[], logs: AutomationAuditLog[], notifications: AutomationNotification[] } {
  const updatedJobs: Job[] = [];
  const logs: AutomationAuditLog[] = [];
  const notifications: AutomationNotification[] = [];
  const now = new Date();

  jobs.forEach(job => {
    if (job.status === 'scheduled' && job.publishStartDate && new Date(job.publishStartDate) <= now) {
      const updatedJob = { ...job, status: 'published' as const, publishStartDate: now.toISOString() };
      updatedJobs.push(updatedJob);

      logs.push({
        id: `log-publish-${Date.now()}`,
        entityId: job.id,
        entityType: 'job',
        action: 'SCHEDULED_PUBLISH',
        previousValue: 'scheduled',
        newValue: 'published',
        timestamp: now,
        triggeredBy: 'AutomationEngine',
      });
      
      notifications.push(notificationService.sendStatusChangeNotification(job, 'published'));
    }
  });

  return { updatedJobs, logs, notifications };
}
