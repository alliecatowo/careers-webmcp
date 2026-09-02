'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
      <CardContent>
        <Button data-testid="demo-sign-in" onClick={() => signInAsDemoCandidate()}>
          Continue as demo candidate
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
      router.push(`/careers/application/${slug}/success?appId=${draft.id}`);
    } catch (err) {
      if (err instanceof ApplicationError && err.code === 'VALIDATION_ERROR') {
        setSubmitError('Please fill in all required fields before submitting.');
      } else {
        setSubmitError('Something went wrong submitting your application. Please try again.');
      }
    } finally {
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
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                {...register(field.name, {
                  onChange: (e) => handleFieldCommit(field.name, e.target.value),
                })}
              />
            ) : (
              <Input
                id={field.name}
                type={field.type === 'number' ? 'number' : field.type}
                placeholder={field.placeholder}
                {...register(field.name, {
                  valueAsNumber: field.type === 'number',
                  onChange: (e) => {
                    const value =
                      field.type === 'number'
                        ? e.target.value === ''
                          ? null
                          : Number(e.target.value)
                        : e.target.value;
                    handleFieldCommit(field.name, value);
                  },
                })}
              />
            )}
            {errors[field.name] && (
              <p className="text-sm text-destructive">{errors[field.name]?.message as string}</p>
            )}
          </div>
        ))}

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <div className="flex justify-end items-center pt-6 mt-6 border-t">
          <Button type="submit" disabled={isSubmitting} data-testid="submit-application">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Application
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
