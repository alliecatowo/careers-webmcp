'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Notification, NotificationType } from '@/types';
import { Bell, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTimezone } from '@/hooks/use-timezone';

function getNotificationIcon(type: NotificationType) {
    switch(type) {
        case 'STAGE_UPDATE':
            return <FileText className="h-4 w-4" />;
        case 'INTERVIEW_SCHEDULED':
            return <Calendar className="h-4 w-4" />;
        case 'DOCUMENT_REQUEST':
            return <Bell className="h-4 w-4" />;
        default:
            return <Bell className="h-4 w-4" />;
    }
}

export function Notifications({ notifications, isLoading }: { notifications: Notification[], isLoading: boolean }) {
    const { toLocalTime } = useTimezone();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No new notifications.</p>
                ) : (
                    <ul className="space-y-4">
                        {notifications.map((notif) => (
                            <li key={notif.id} className="flex items-start gap-4">
                                <div className={cn(
                                    "mt-1 rounded-full p-2",
                                    notif.read ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                                )}>
                                    {getNotificationIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <p className={cn("text-sm", !notif.read && "font-semibold")}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {toLocalTime(notif.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
