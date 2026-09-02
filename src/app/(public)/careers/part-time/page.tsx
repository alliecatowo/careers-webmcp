import { Metadata } from 'next';
import { talentService } from '@/services/talent.service';
import { JobCard } from '@/modules/talent-acquisition/components/JobCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Part-Time Roles | Baalvion Careers',
  description:
    'Explore flexible, part-time roles at Baalvion and contribute to our mission on your schedule.',
};

export default async function PartTimeRolesPage() {
  const [jobs, countries, departments] = await Promise.all([
    talentService.getJobs({ status: 'published', employmentType: 'Part-time' }),
    talentService.getCountries({ isActive: true }),
    talentService.getDepartments({ isActive: true }),
  ]);

  return (
    <main className="bg-background text-foreground">
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Part-Time Roles
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Flexible opportunities for talented individuals. Make a global
            impact, part-time.
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
                  No Part-Time Positions Available Currently
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
