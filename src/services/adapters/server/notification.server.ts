import { apiClient } from '@/lib/apiClient';
import { socketEngine } from '@/lib/realtime/socket.engine';
import { Notification } from '@/features/notifications';

export const notificationServerService = {
  async getNotifications(tenantId: string): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(
      `/notifications?tenantId=${tenantId}`,
    );
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch notifications');
    return (response.data as Notification[]) || [];
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.post(`/notifications/${id}/read`, {});
  },

  async markAllAsRead(tenantId: string): Promise<void> {
    await apiClient.post(`/notifications/mark-all-read`, { tenantId });
  },

  subscribeToNotifications(
    callback: (notification: Notification) => void,
  ): () => void {
    // Connect to the real socket server
    socketEngine.connect();

    // Define the event handler
    const handler = (notification: Notification) => {
      // Here you might add validation or transformation logic
      callback(notification);
    };

    // Listen for the specific 'NEW_NOTIFICATION' event from the server
    socketEngine.on('NEW_NOTIFICATION', handler);

    // Return a function to clean up the subscription
    return () => {
      console.log('Unsubscribing from real-time notifications.');
      socketEngine.disconnect();
      // In a real socket implementation, you'd also remove the specific listener.
      // e.g., socketEngine.off('NEW_NOTIFICATION', handler);
    };
  },
};
