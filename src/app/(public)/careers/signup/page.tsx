'use client';
/**
 * Normal candidate sign-up.
 *
 * This is an ordinary form: a human can fill it in and create an account with
 * no agent involved. `careers_create_account` fills the same draft store this
 * form is bound to, so an agent-prepared account appears here as a pre-filled
 * form — the person still presses Create account themselves, and that button is
 * the only thing that creates a session.
 */
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Sparkle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionStore } from '@/domain/session/session.store';
import {
  useSignUpStore,
  setSignUpFields,
  completeSignUp,
  validateSignUpFields,
  SignUpError,
  type SignUpFields,
} from '@/domain/session/signup.store';
import { useAgentHighlight, AGENT_FLASH_CLASS, usePresenceStore, setPendingConfirmation } from '@/webmcp/presence';

const FIELDS: {
  name: keyof SignUpFields;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'tel' | 'url' | 'number';
  placeholder: string;
}[] = [
  { name: 'fullName', label: 'Full name', required: true, type: 'text', placeholder: 'Jane Doe' },
  { name: 'email', label: 'Email address', required: true, type: 'email', placeholder: 'jane.doe@example.com' },
  { name: 'phone', label: 'Phone number', required: false, type: 'tel', placeholder: '+1 (555) 123-4567' },
  { name: 'location', label: 'Location', required: false, type: 'text', placeholder: 'Oakland, CA' },
  { name: 'linkedinUrl', label: 'LinkedIn profile', required: false, type: 'url', placeholder: 'https://linkedin.com/in/...' },
  { name: 'portfolioUrl', label: 'Portfolio / GitHub', required: false, type: 'url', placeholder: 'https://github.com/...' },
  { name: 'yearsExperience', label: 'Years of experience', required: false, type: 'number', placeholder: '5' },
];

function SignUpField({ field }: { field: (typeof FIELDS)[number] }) {
  const value = useSignUpStore((s) => s.fields[field.name]);
  const flashing = useAgentHighlight(field.name);

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={field.name}
        type={field.type}
        placeholder={field.placeholder}
        data-testid={`signup-${field.name}`}
        value={value === null || value === undefined ? '' : String(value)}
        onChange={(e) =>
          setSignUpFields(
            {
              [field.name]:
                field.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value,
            } as Partial<SignUpFields>,
            'human',
          )
        }
        className={flashing ? AGENT_FLASH_CLASS : 'transition-[box-shadow,background-color] duration-300'}
      />
    </div>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidate = useSessionStore((s) => s.candidate);
  const sessionStatus = useSessionStore((s) => s.status);
  const fields = useSignUpStore((s) => s.fields);
  const origin = useSignUpStore((s) => s.origin);
  const pending = usePresenceStore((s) => s.pendingConfirmation);

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const validation = validateSignUpFields(fields);
  const agentPrepared = origin === 'agent';
  const awaitingConfirmation = pending?.kind === 'create_account';

  // Already signed in? Nothing to create.
  useEffect(() => {
    if (sessionStatus === 'ready' && candidate) {
      setPendingConfirmation(null);
    }
  }, [sessionStatus, candidate]);

  const onSubmit = () => {
    setError(null);
    setBusy(true);
    try {
      completeSignUp();
      setPendingConfirmation(null);
      router.push(searchParams.get('next') || '/careers/open-positions');
    } catch (err) {
      if (err instanceof SignUpError) {
        setError(
          err.code === 'VALIDATION_ERROR'
            ? 'Please add a name and a valid email address before creating your account.'
            : err.message,
        );
      } else {
        setError('Something went wrong creating your account. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  if (sessionStatus === 'ready' && candidate) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <CardTitle>You&apos;re signed in</CardTitle>
          <CardDescription>Signed in as {candidate.displayName}.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/careers/open-positions">Browse open roles</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/my-account">My account</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl" data-testid="signup-card">
      <CardHeader>
        <CardTitle>Create your candidate account</CardTitle>
        <CardDescription>
          One account to save roles and track your applications. Only your name and email are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {agentPrepared && (
          <div
            className="mb-6 flex items-start gap-2 rounded-md border border-sky-400/30 bg-sky-400/5 px-3 py-2 text-sm"
            data-testid="signup-agent-notice"
          >
            <Sparkle className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
            <p className="text-muted-foreground">
              These details were filled in for you. Check them over and edit anything that looks wrong — nothing is
              created until you press <span className="font-medium text-foreground">Create account</span>.
            </p>
          </div>
        )}

        <form
          className="space-y-5"
          data-testid="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <SignUpField key={field.name} field={field} />
            ))}
          </div>

          {validation.invalidFields.length > 0 && (
            <ul className="space-y-1 text-sm text-destructive">
              {validation.invalidFields.map((issue) => (
                <li key={issue.field}>
                  {FIELDS.find((f) => f.name === issue.field)?.label}: {issue.reason}
                </li>
              ))}
            </ul>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-between gap-4 border-t pt-5">
            <p className="text-xs text-muted-foreground">
              Demo site. No real account is created and nothing is sent anywhere.
            </p>
            <Button
              type="submit"
              disabled={busy || !validation.valid}
              data-testid="confirm-signup"
              className={
                awaitingConfirmation && validation.valid
                  ? 'ring-2 ring-amber-400/80 ring-offset-2 ring-offset-background animate-pulse'
                  : undefined
              }
            >
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function SignUpPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="container mx-auto px-4 py-20 sm:py-28">
        <Suspense fallback={null}>
          <SignUpForm />
        </Suspense>
      </section>
    </main>
  );
}
