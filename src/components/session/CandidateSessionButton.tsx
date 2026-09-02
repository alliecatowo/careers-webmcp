'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSessionStore } from '@/domain/session/session.store';

/**
 * Normal human sign-in control. The demo candidate session it creates is the
 * SAME session WebMCP tools read; there is no separate agent auth.
 */
export function CandidateSessionButton({ className }: { className?: string }) {
  const candidate = useSessionStore((s) => s.candidate);
  const status = useSessionStore((s) => s.status);
  const signIn = useSessionStore((s) => s.signInAsDemoCandidate);
  const signOut = useSessionStore((s) => s.signOut);
  const router = useRouter();
  const pathname = usePathname();

  if (status !== 'ready') return <div className={className} style={{ width: 160, height: 40 }} />;

  if (!candidate) {
    return (
      <Button className={className} data-testid="demo-sign-in" onClick={() => signIn()}>
        Continue as Avery Chen
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} data-testid="session-menu">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback className="text-xs">{candidate.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          {candidate.displayName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium">{candidate.displayName}</p>
          <p className="text-xs text-muted-foreground">{candidate.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/my-account">My applications</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          data-testid="demo-sign-out"
          onClick={() => {
            signOut();
            if (pathname?.startsWith('/my-account')) router.push('/careers/open-positions');
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
