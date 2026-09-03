'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { talentService } from '@/services/talent.service';
import { Job, Country } from '@/lib/talent-acquisition';
import { useSessionStore } from '@/domain/session/session.store';
import { CurrentApplicationBridge } from '@/domain/ui-context/bridges';
import {
  useAgentAttention,
  scrollAgentTargetIntoView,
  AGENT_FLASH_CLASS,
  usePresenceStore,
  clearFocusRequest,
  setPendingConfirmation,
} from '@/webmcp/presence';
import {
  ApplicationError,
  ApplicationFields,
  applicationFieldsSchema,
  startApplication,
  updateApplication,
  submitApplication,
  useApplicationsStore,
} from '@/domain/applications';

const FIELD_ORDER: {
  name: keyof ApplicationFields;
  label: string;
  required: boolean;
  type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'textarea';
  placeholder?: string;
}[] = [
  { name: 'fullName', label: 'Full Name', required: true, type: 'text', placeholder: 'Jane Doe' },
  { name: 'email', label: 'Email Address', required: true, type: 'email', placeholder: 'jane.doe@example.com' },
  { name: 'phone', label: 'Phone Number', required: true, type: 'tel', placeholder: '+1 (555) 123-4567' },
  { name: 'location', label: 'Location', required: true, type: 'text', placeholder: 'Oakland, CA' },
  { name: 'linkedinUrl', label: 'LinkedIn Profile', required: false, type: 'url', placeholder: 'https://linkedin.com/in/...' },
  { name: 'portfolioUrl', label: 'Portfolio / GitHub URL', required: false, type: 'url', placeholder: 'https://github.com/...' },
  { name: 'yearsExperience', label: 'Years of Experience', required: true, type: 'number', placeholder: '5' },
  { name: 'availability', label: 'Availability', required: true, type: 'text', placeholder: 'e.g. Available from October 2026' },
  { name: 'coverNote', label: 'Cover Note', required: false, type: 'textarea', placeholder: "Briefly tell us why you're a great fit." },
];


type FieldSpec = (typeof FIELD_ORDER)[number];

/**
 * One application field.
 *
 * Split out of the form so each input can subscribe to agent activity on its
 * own: it flashes when `careers_update_application` writes it, and takes focus
 * when `careers_focus_application_field` points at it. The focus is performed
 * here, by the component that owns the ref — the tool never touches the DOM.
 */
function ApplicationFormField({
  field,
  register,
  errors,
  onCommit,
}: {
  field: FieldSpec;
  register: UseFormRegister<ApplicationFields>;
  errors: FieldErrors<ApplicationFields>;
  onCommit: (name: keyof ApplicationFields, value: string | number | null) => void;
}) {
  const elementRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const flashing = useAgentAttention(field.name, elementRef);
  const focusRequest = usePresenceStore((s) => s.focusRequest);

  const requestedAt = focusRequest?.key === field.name ? focusRequest.at : null;
  useEffect(() => {
    if (requestedAt === null) return;
    const element = elementRef.current;
    if (element) {
      scrollAgentTargetIntoView(element);
      element.focus({ preventScroll: true });
    }
    clearFocusRequest();
  }, [requestedAt]);

  const isTextarea = field.type === 'textarea';
  const registration = register(field.name, {
    valueAsNumber: field.type === 'number',
    onChange: (e: { target: { value: string } }) => {
      const value =
        field.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value;
      onCommit(field.name, value);
    },
  });
  // Keep react-hook-form's ref working while also holding our own.
  const ref = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
    registration.ref(element);
    elementRef.current = element;
  };

  const className = flashing ? AGENT_FLASH_CLASS : 'transition-[box-shadow,background-color] duration-300';

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>
      {isTextarea ? (
        <Textarea id={field.name} placeholder={field.placeholder} className={className} {...registration} ref={ref} />
      ) : (
        <Input
          id={field.name}
          type={field.type === 'number' ? 'number' : field.type}
          placeholder={field.placeholder}
          className={className}
          {...registration}
          ref={ref}
        />
      )}
      {errors[field.name] && <p className="text-sm text-destructive">{errors[field.name]?.message as string}</p>}
    </div>
  );
}

function ApplicationLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

function SignInToApply() {
  const signInAsDemoCandidate = useSessionStore((s) => s.signInAsDemoCandidate);
  return (
    <Card className="max-w-md mx-auto text-center">
      <CardHeader>
        <CardTitle>Sign in to apply</CardTitle>
        <CardDescription>You need a candidate session to start or continue an application.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <Button data-testid="demo-sign-in" onClick={() => signInAsDemoCandidate()}>
          Continue as demo candidate
        </Button>
        <Button variant="link" size="sm" asChild>
          <Link href="/careers/signup">Or create an account</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function ApplicationForm() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params.slug;
  const jobId = searchParams.get('jobId');

  const sessionStatus = useSessionStore((s) => s.status);
  const candidate = useSessionStore((s) => s.candidate);

  const [job, setJob] = useState<Job | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pendingConfirmation = usePresenceStore((s) => s.pendingConfirmation);
  const awaitingSubmit = pendingConfirmation?.kind === 'submit_application';

  // Load job + country for this route.
  useEffect(() => {
    if (!jobId || !slug) {
      setNotFoundError(true);
      return;
    }
    let cancelled = false;
    Promise.all([talentService.getJobById(jobId), talentService.getCountryBySlug(slug)])
      .then(([fetchedJob, fetchedCountry]) => {
        if (cancelled) return;
        if (!fetchedJob || !fetchedCountry) {
          setNotFoundError(true);
          return;
        }
        setJob(fetchedJob);
        setCountry(fetchedCountry);
      })
      .catch(() => {
        if (!cancelled) setNotFoundError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId, slug]);

  // Start (or resume) the application once we have a signed-in candidate + job.
  useEffect(() => {
    if (candidate && job && country) {
      const draft = startApplication(candidate, { id: job.id, title: job.title, countrySlug: country.slug });
      setDraftId(draft.id);
    }
  }, [candidate, job, country]);

  const draft = useApplicationsStore((s) => (draftId ? (s.applications[draftId] ?? null) : null));

  // The submit error is a statement about a specific revision of the draft.
  // The moment anyone changes the draft — the human typing, or the agent via
  // careers_update_application — that statement is stale, so it goes. Without
  // this the form kept showing "fill in all required fields" after the agent
  // had already filled them, which is the page and the store disagreeing.
  const draftRevision = draft?.revision ?? null;
  useEffect(() => {
    setSubmitError(null);
  }, [draftRevision]);

  const methods = useForm<ApplicationFields>({
    resolver: zodResolver(applicationFieldsSchema),
    mode: 'onChange',
    values: draft?.fields,
  });

  const handleFieldCommit = (name: keyof ApplicationFields, value: string | number | null) => {
    if (!candidate || !draft || draft.status !== 'draft') return;
    try {
      updateApplication(candidate.id, draft.id, null, { [name]: value } as Partial<ApplicationFields>);
    } catch (err) {
      if (err instanceof ApplicationError && err.code === 'VALIDATION_ERROR') {
        // Invalid intermediate value (e.g. mid-typed email) — not persisted, form still shows the typed text.
        return;
      }
      // STALE_APPLICATION / ALREADY_SUBMITTED shouldn't happen for human writes (expectedRevision: null),
      // but don't crash the form if they do.
      console.error(err);
    }
  };

  const onSubmit = async () => {
    if (!candidate || !draft) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      submitApplication(candidate.id, draft.id, null);
      setPendingConfirmation(null);
      // Deliberately leave isSubmitting true on the success path. The store
      // write is synchronous, so clearing it here would unset the flag in the
      // same tick it was set and the button would never render its pending
      // state — the click would look like nothing happened until the route
      // finally changed. Navigation unmounts this form instead.
      router.push(`/careers/application/${slug}/success?appId=${draft.id}`);
    } catch (err) {
      if (err instanceof ApplicationError && err.code === 'VALIDATION_ERROR') {
        setSubmitError('Please fill in all required fields before submitting.');
      } else {
        setSubmitError('Something went wrong submitting your application. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  if (sessionStatus === 'hydrating') {
    return <ApplicationLoadingSkeleton />;
  }

  if (!candidate) {
    return <SignInToApply />;
  }

  if (notFoundError) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Invalid job or country specified.</p>
        <Button variant="link" asChild>
          <Link href="/careers/open-positions">Return to Job Listings</Link>
        </Button>
      </div>
    );
  }

  if (!job || !country || !draft) {
    return <ApplicationLoadingSkeleton />;
  }

  if (draft.status === 'submitted') {
    return (
      <>
        <CurrentApplicationBridge applicationId={draft.id} />
        <Card className="max-w-2xl mx-auto text-center" data-testid="application-submitted-summary">
          <CardHeader className="items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <Badge variant="secondary" className="mb-2">
              Submitted
            </Badge>
            <CardTitle>{draft.jobTitle}</CardTitle>
            <CardDescription>Your application has been submitted and is read-only.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/my-account">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  const { register, formState } = methods;
  const errors = formState.errors;

  return (
    <>
      <CurrentApplicationBridge applicationId={draft.id} />
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Apply for {job.title}</h1>
        <p className="text-muted-foreground">Location: {country.name}</p>
        <p className="text-xs text-muted-foreground">
          Draft saved · revision <span data-testid="application-revision">{draft.revision}</span>
        </p>
      </div>

      <form
        data-testid="application-form"
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {FIELD_ORDER.map((field) => (
          <ApplicationFormField
            key={field.name}
            field={field}
            register={register}
            errors={errors}
            onCommit={handleFieldCommit}
          />
        ))}

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-6 mt-6">
          {awaitingSubmit && (
            <p className="mr-auto text-sm text-muted-foreground" data-testid="submit-handoff-note">
              Everything checks out. Sending it is your call.
            </p>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            data-testid="submit-application"
            className={
              awaitingSubmit ? 'animate-pulse ring-2 ring-amber-400/80 ring-offset-2 ring-offset-background' : undefined
            }
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Submitting…' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplicationLoadingSkeleton />}>
      <ApplicationForm />
    </Suspense>
  );
}
