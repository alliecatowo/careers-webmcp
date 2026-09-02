
import { redirect, notFound } from 'next/navigation';
import { talentService } from '@/services/talent.service';

// This page now serves as a permanent redirect to the new SEO-friendly URL structure.
export default async function LegacyJobRedirectPage({ params }: { params: { id: string }}) {
    const job = await talentService.getJobById(params.id);

    if (!job) {
        notFound();
    }
    
    const country = await talentService.getCountryById(job.countryId);

    if (!country) {
        // This could happen if the job's country is no longer active.
        // Redirecting to a generic open positions page is a safe fallback.
        redirect(`/careers/open-positions`);
    }
    
    // Perform a permanent redirect (HTTP 308) to the new URL structure.
    redirect(`/careers/countries/${country.slug}/jobs/${job.id}`);
}
