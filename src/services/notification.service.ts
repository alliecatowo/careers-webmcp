import { Notification } from '@/features/notifications';
import { adapter } from './adapter';

export const notificationService = {
  getNotifications: (tenantId: string): Promise<Notification[]> => adapter.getNotifications(tenantId),
  getNotificationsForCandidate: (candidateId: string) => adapter.getNotificationsForCandidate(candidateId),
  markAsRead: (id: string): Promise<void> => adapter.markAsRead(id),
  markAllAsRead: (tenantId: string): Promise<void> => adapter.markAllAsRead(tenantId),
  subscribeToNotifications: (callback: (notification: Notification) => void): () => void => adapter.subscribeToNotifications(callback),
  sendNotification: (userId: string, notification: Partial<Notification>) => {
      adapter.sendNotification(userId, notification);
  },
  sendEmail: (studentId: string, subject: string, body: string): Promise<any> => adapter.sendEmail(studentId, subject, body),
};
