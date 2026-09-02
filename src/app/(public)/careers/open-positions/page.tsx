import { Metadata } from 'next';
import { talentService } from '@/services/talent.service';
import { GlobalJobListing } from '@/modules/talent-acquisition/components/GlobalJobListing';
import { RecentlyViewedJobs } from '@/modules/jobs/components/RecentlyViewedJobs';

export const metadata: Metadata = {
    title: "Open Positions Worldwide | Baalvion Careers",
    description: "Explore your next challenge and join our global team. Search for open roles in Engineering, Design, Product, and more across our global hiring regions.",
};

export default async function OpenPositionsPage() {
    // Fetch data needed for filters, but not the jobs themselves.
    // The client component `GlobalJobListing` will fetch jobs.
    const [countries, departments] = await Promise.all([
        talentService.getCountries({ isActive: true }),
        talentService.getDepartments({ isActive: true })
    ]);

    return (
        <main className="bg-background text-foreground">
             <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Open Positions Worldwide</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        Explore your next challenge and join our global team, wherever you are.
                    </p>
                </div>
            </section>

             <section id="open-positions" className="py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <GlobalJobListing 
                        countries={countries}
                        departments={departments}
                    />
                    <RecentlyViewedJobs />
                </div>
            </section>
        </main>
    );
}
