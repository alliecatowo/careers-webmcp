
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-12 text-center">
        <div className="mx-auto w-fit bg-destructive/10 p-4 rounded-full">
            <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-destructive">An Error Occurred</h3>
        <p className="mt-2 text-destructive/80">{message}</p>
        {onRetry && (
            <Button onClick={onRetry} variant="destructive" className="mt-6">
                Try Again
            </Button>
        )}
      </CardContent>
    </Card>
  );
}
