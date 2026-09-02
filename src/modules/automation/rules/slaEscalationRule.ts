
import { Job } from '@/lib/talent-acquisition';
import { AutomationAuditLog, AutomationEscalation, AutomationNotification } from '../types';
import { escalationService } from '../triggers/EscalationService';
import { notificationService } from '../notifications/NotificationService';

const PENDING_STATUSES: Job['status'][] = ['internal-review', 'compliance-review'];

export function runSlaEscalationRule(jobs: Job[]): { logs: AutomationAuditLog[], notifications: AutomationNotification[], escalations: AutomationEscalation[] } {
  const logs: AutomationAuditLog[] = [];
  const notifications: AutomationNotification[] = [];
  const escalations: AutomationEscalation[] = [];
  const now = new Date();

  jobs.forEach(job => {
    if (PENDING_STATUSES.includes(job.status)) {
      const slaDays = job.priority === 'Critical' ? 1 : 3;
      const lastUpdate = new Date(job.updatedAt);
      const daysPending = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);

      if (daysPending > slaDays) {
        const reason = `Job has been in status "${job.status}" for more than ${slaDays} day(s).`;
        escalations.push(escalationService.escalateToRole(job.id, 'ADMIN', reason));
        notifications.push(notificationService.sendSLAAlert(job, reason));
        logs.push({
          id: `log-sla-${Date.now()}`,
          entityId: job.id,
          entityType: 'job',
          action: 'SLA_BREACH',
          newValue: { status: job.status, daysPending: Math.round(daysPending) },
          timestamp: now,
          triggeredBy: 'AutomationEngine',
        });
      }
    }
  });

  return { logs, notifications, escalations };
}
