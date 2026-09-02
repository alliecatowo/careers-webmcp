import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background text-center">
            <h1 className="text-4xl font-bold text-destructive">Access Denied</h1>
            <p className="mt-4 text-lg text-muted-foreground">You do not have the necessary permissions to view this page.</p>
            <p className="mt-2 text-sm text-muted-foreground">Please contact your system administrator if you believe this is an error.</p>
            <Button asChild className="mt-8">
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
}
