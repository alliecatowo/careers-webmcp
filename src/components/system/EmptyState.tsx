
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
}

export function EmptyState({ title = "No Results Found", message }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="mx-auto w-fit bg-muted p-4 rounded-full">
            <Inbox className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}
