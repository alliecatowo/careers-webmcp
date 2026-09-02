
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { talentService } from '@/services/talent.service';
import { Job, Country } from '@/lib/talent-acquisition';
import { formConfig } from '@/config/application-form-config';
import { PhaseRenderer } from '@/components/application/PhaseRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplicationStore } from '@/store/application.store';
import { multiPhaseApplicationSchema } from '@/types/application.types';

type Phase1Data = z.infer<typeof multiPhaseApplicationSchema>;

function ApplicationForm() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { applicationData, setApplicationData } = useApplicationStore();

    const slug = params.slug as string;
    const jobId = searchParams.get('jobId');

    const [job, setJob] = useState<Job | null>(null);
    const [country, setCountry] = useState<Country | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!slug || !jobId || slug === 'undefined') {
                router.replace('/careers/open-positions');
                return;
            }

            setIsLoading(true);
            try {
                const [fetchedJob, fetchedCountry] = await Promise.all([
                    talentService.getJobById(jobId),
                    talentService.getCountryBySlug(slug)
                ]);
                
                if (!fetchedJob || !fetchedCountry || fetchedJob.countryId !== fetchedCountry.id) {
                    router.replace('/careers/open-positions');
                    return;
                }
                setJob(fetchedJob);
                setCountry(fetchedCountry);
                
                setApplicationData({ jobId });
            } catch (err) {
                console.error(err);
                router.replace('/careers/open-positions');
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [slug, jobId, router, setApplicationData]);

    const methods = useForm<Phase1Data>({
        resolver: zodResolver(multiPhaseApplicationSchema),
        defaultValues: { ...applicationData, jobId: jobId || '' },
        mode: 'onChange',
    });

    const phase = formConfig.phases[0];

    const handleNext = async () => {
        const isValid = await methods.trigger(phase.fields.map(f => f.name) as (keyof Phase1Data)[]);
        if (isValid) {
            setApplicationData(methods.getValues());
            router.push(`/careers/application/${slug}/phase2?jobId=${jobId}`);
        }
    };

    if (isLoading) return <ApplicationLoadingSkeleton />;
    if (!job || !country) {
         return (
             <div className="text-center py-10">
                <p className="text-muted-foreground">Invalid job or country specified.</p>
                <Button variant="link" asChild><Link href="/careers/open-positions">Return to Job Listings</Link></Button>
            </div>
         );
    }

    return (
        <FormProvider {...methods}>
             <div className="space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Apply for {job.title}</h1>
                <p className="text-muted-foreground">Location: {country.name}</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <PhaseRenderer phase={phase} country={country} />
                <div className="flex justify-end items-center pt-8 mt-8 border-t">
                    <Button type="button" onClick={handleNext}>Next: Skills & Projects</Button>
                </div>
            </form>
        </FormProvider>
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

export default function ApplyPage() {
    return (
        <Suspense fallback={<ApplicationLoadingSkeleton />}>
            <ApplicationForm />
        </Suspense>
    )
}
