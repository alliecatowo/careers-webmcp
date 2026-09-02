
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface ApplyCTAProps {
    applyUrl: string;
    className?: string;
}

export function ApplyCTA({ applyUrl, className }: ApplyCTAProps) {
    return (
        <Button asChild size="lg" className={className}>
            <Link href={applyUrl}>Apply Now</Link>
        </Button>
    )
}
