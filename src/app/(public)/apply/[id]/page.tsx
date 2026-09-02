
"use client";
import { redirect, notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { talentService } from '@/services/talent.service';
import { LoadingState } from '@/components/system/LoadingState';

// This page serves as a redirector from the old URL structure `/apply/[jobId]`
// to the new, country-aware structure `/careers/application/[countrySlug]?jobId=[jobId]`
export default function DeprecatedApplyPage() {
    const params = useParams();
    const jobId = params.id as string;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCountryAndRedirect = async () => {
            if (!jobId) {
                redirect('/careers/open-positions');
                return;
            }

            try {
                const job = await talentService.getJobById(jobId);
                if (job) {
                    const country = await talentService.getCountryById(job.countryId);
                    if (country) {
                        redirect(`/careers/application/${country.slug}?jobId=${jobId}`);
                        return;
                    }
                }
                // If job or country not found, go to a 404 page.
                notFound();
            } catch (error) {
                console.error("Redirection failed:", error);
                // On error, redirect to a safe fallback.
                redirect('/careers/open-positions');
            }
        }
        getCountryAndRedirect();
    }, [jobId]);

    // Although the redirect happens quickly, show a loading state
    // to prevent flashing content or a blank page.
    if (isLoading) {
        return <LoadingState message="Redirecting to application..." />;
    }

    return null;
}
