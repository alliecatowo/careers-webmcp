
import { AutomationNotification } from '../types';
import { Job } from '@/lib/talent-acquisition';

class NotificationService {
  public sendStatusChangeNotification(job: Job, newStatus: string): AutomationNotification {
    const notification: AutomationNotification = {
      id: `notif-${Date.now()}`,
      type: 'STATUS_CHANGE',
      recipientRole: 'RECRUITER',
      message: `Job "${job.title}" (${job.id}) has been automatically moved to status: ${newStatus}.`,
      entityId: job.id,
      entityType: 'job',
      timestamp: new Date(),
    };
    console.log(`[NotificationService] Firing: ${notification.message}`);
    return notification;
  }

  public sendSLAAlert(job: Job, reason: string): AutomationNotification {
    const notification: AutomationNotification = {
      id: `notif-${Date.now()}`,
      type: 'SLA_BREACH',
      recipientRole: 'ADMIN',
      message: `SLA Breach Alert for job "${job.title}" (${job.id}): ${reason}.`,
      entityId: job.id,
      entityType: 'job',
      timestamp: new Date(),
    };
    console.log(`[NotificationService] Firing: ${notification.message}`);
    return notification;
  }
}

export const notificationService = new NotificationService();
