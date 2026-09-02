import { Bell } from 'lucide-react';

export function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-full bg-muted p-4">
        <Bell className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="font-semibold">All caught up!</h3>
        <p className="text-sm text-muted-foreground">You have no new notifications.</p>
      </div>
    </div>
  );
}
