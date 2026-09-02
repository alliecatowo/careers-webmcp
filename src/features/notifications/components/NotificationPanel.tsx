'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationEmpty } from './NotificationEmpty';
import { NotificationItem } from './NotificationItem';
import { Loader2 } from 'lucide-react';

export function NotificationPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" className="h-auto p-0" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </div>
      <Separator />
      {loading ? (
        <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
        </div>
      ) : notifications.length === 0 ? (
        <NotificationEmpty />
      ) : (
        <ScrollArea className="flex-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={markAsRead}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
