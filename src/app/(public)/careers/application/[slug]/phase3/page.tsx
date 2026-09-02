
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Country } from '@/lib/talent-acquisition';
import { formConfig } from '@/config/application-form-config';
import { PhaseRenderer } from '@/components/application/PhaseRenderer';
import { useApplicationStore } from '@/store/application.store';
import { multiPhaseApplicationSchema, MultiPhaseApplicationData } from '@/types/application.types';
import { applicationService } from '@/services/application.service';
import { talentService } from '@/services/talent.service';
import { useToast } from '@/components/system/Toast/useToast';

type Phase3Data = z.infer<typeof multiPhaseApplicationSchema>;

function Phase3Form() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { applicationData, setApplicationData, resetApplicationData } = useApplicationStore();
    const { showToast } = useToast();
    
    const slug = params.slug as string;
    const jobId = searchParams.get('jobId');

    const [country, setCountry] = useState<Country | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const redirectUrl = `/careers/application/${slug}${jobId ? `?jobId=${jobId}`: ''}`;
        if (!applicationData.fullName || !applicationData.primaryExpertise || !jobId) {
            router.replace(redirectUrl);
            return;
        }
        async function fetchCountry() {
             try {
                const fetchedCountry = await talentService.getCountryBySlug(slug);
                if(fetchedCountry) setCountry(fetchedCountry);
                else router.replace(redirectUrl);
            } catch {
                router.replace(redirectUrl);
            }
        }
        fetchCountry();
    }, [applicationData, slug, router, jobId]);

    const methods = useForm<Phase3Data>({
        resolver: zodResolver(multiPhaseApplicationSchema),
        defaultValues: applicationData,
        mode: 'onChange',
    });

    const phase = formConfig.phases[2];
    
    const onSubmit = async (data: Phase3Data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const finalData = { ...applicationData, ...data };
            const result = await applicationService.submitMultiPhaseApplication(slug, finalData as MultiPhaseApplicationData);
            
            // Don't reset data yet, so success page can use it.
            // resetApplicationData();
            
            router.push(`/careers/application/${slug}/success?jobId=${jobId}&appId=${result.applicationId}`);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
             showToast({ type: 'error', title: 'Submission Failed', description: err.message || "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleBack = () => {
        setApplicationData(methods.getValues());
        router.back();
    };
    
    if(!country) return <Loader2 className="animate-spin" />;

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                <PhaseRenderer phase={phase} country={country} />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex justify-between items-center pt-8 mt-8 border-t">
                    <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Application
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default function Phase3Page() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <Phase3Form />
        </Suspense>
    );
}
