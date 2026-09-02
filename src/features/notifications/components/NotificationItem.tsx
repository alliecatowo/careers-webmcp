import { cn } from '@/lib/utils';
import { Notification, NotificationType } from '../types';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Link from 'next/link';

const typeMap: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  INFO: { icon: Info, color: 'text-blue-500' },
  SUCCESS: { icon: CheckCircle, color: 'text-green-500' },
  WARNING: { icon: AlertTriangle, color: 'text-yellow-500' },
  ERROR: { icon: XCircle, color: 'text-destructive' },
};

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = typeMap[notification.type]?.icon || Info;
  const iconColor = typeMap[notification.type]?.color || 'text-muted-foreground';

  const content = (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-4 p-4 transition-colors hover:bg-muted/50",
        !notification.read && "bg-blue-500/5"
      )}
      onClick={() => onClick(notification.id)}
    >
      {!notification.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
      <Icon className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">{notification.title}</p>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}
