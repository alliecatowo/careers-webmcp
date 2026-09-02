
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
import { multiPhaseApplicationSchema } from '@/types/application.types';
import { talentService } from '@/services/talent.service';

type Phase2Data = z.infer<typeof multiPhaseApplicationSchema>;

function Phase2Form() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { applicationData, setApplicationData } = useApplicationStore();
    
    const slug = params.slug as string;
    const jobId = searchParams.get('jobId');

    const [country, setCountry] = useState<Country | null>(null);

    useEffect(() => {
        const redirectUrl = `/careers/application/${slug}${jobId ? `?jobId=${jobId}`: ''}`;
        if (!applicationData.fullName || !applicationData.email || !jobId) {
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

    const methods = useForm<Phase2Data>({
        resolver: zodResolver(multiPhaseApplicationSchema),
        defaultValues: applicationData,
        mode: 'onChange',
    });

    const phase = formConfig.phases[1];

    const handleNext = async () => {
        const isValid = await methods.trigger(phase.fields.map(f => f.name) as (keyof Phase2Data)[]);
        if (isValid) {
            setApplicationData(methods.getValues());
            router.push(`/careers/application/${slug}/phase3?jobId=${jobId}`);
        }
    };
    
    const handleBack = () => {
        setApplicationData(methods.getValues());
        router.back();
    };
    
    if(!country) return <Loader2 className="animate-spin" />;

    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <PhaseRenderer phase={phase} country={country} />
                <div className="flex justify-between items-center pt-8 mt-8 border-t">
                    <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                    <Button type="button" onClick={handleNext}>Next: Verification</Button>
                </div>
            </form>
        </FormProvider>
    );
}

export default function Phase2Page() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <Phase2Form />
        </Suspense>
    );
}
