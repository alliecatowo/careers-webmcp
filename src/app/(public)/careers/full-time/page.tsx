import { Metadata } from 'next';
import { talentService } from '@/services/talent.service';
import { JobCard } from '@/modules/talent-acquisition/components/JobCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Full-Time Roles | Baalvion Careers',
  description:
    'Explore full-time career opportunities at Baalvion and join our mission to build the future of global hiring.',
};

export default async function FullTimeRolesPage() {
  const [jobs, countries, departments] = await Promise.all([
    talentService.getJobs({ status: 'published', employmentType: 'Full-time' }),
    talentService.getCountries({ isActive: true }),
    talentService.getDepartments({ isActive: true }),
  ]);

  return (
    <main className="bg-background text-foreground">
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Full-Time Roles
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Build your career with us. Explore full-time opportunities to make a
            lasting impact on a global scale.
          </p>
        </div>
      </section>

      <section id="open-positions" className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          {jobs.data.length > 0 ? (
            <div className="space-y-6">
              {jobs.data.map((job: any) => (
                <JobCard
                  key={job.id}
                  job={job}
                  departments={departments}
                  countries={countries}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold">
                  No Full-Time Positions Available Currently
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Please check our global listings for all open opportunities.
                </p>
                <Button variant="default" className="mt-4" asChild>
                  <Link href="/careers/open-positions">View All Roles</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
