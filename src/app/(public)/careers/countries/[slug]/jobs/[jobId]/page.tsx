import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { talentService } from '@/services/talent.service';
import { AppConfig } from '@/config/app.config';
import { JobHeader } from '@/modules/talent-acquisition/components/job-detail/JobHeader';
import { JobMetaSidebar } from '@/modules/talent-acquisition/components/job-detail/JobMetaSidebar';
import { JobSection } from '@/modules/talent-acquisition/components/job-detail/JobSection';
import { JobCompensationSection } from '@/modules/talent-acquisition/components/job-detail/JobCompensationSection';
import { JobComplianceSection } from '@/modules/talent-acquisition/components/job-detail/JobComplianceSection';
import { Separator } from '@/components/ui/separator';
import { TrackViewedJob } from '@/modules/jobs/components/TrackViewedJob';
import { generateJobPostingStructuredData } from '@/lib/structured-data';

type Props = {
  params: { slug: string; jobId: string };
};

export async function generateStaticParams() {
  try {
    const jobsResponse = await talentService.getJobs({
      status: 'published',
      limit: 1000,
    });
    const jobs = jobsResponse.data;
    const countries = await talentService.getCountries({ isActive: true });

    return jobs
      .map((job) => {
        const country = countries.find((c) => c.id === job.countryId);
        return {
          slug: country?.slug || '',
          jobId: job.id,
        };
      })
      .filter((p) => p.slug);
  } catch (error) {
    console.error('Failed to generate static params for jobs:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, jobId } = params;
  const job = await talentService.getJobById(jobId);
  const country = await talentService.getCountryBySlug(slug);

  if (!job || !country || job.countryId !== country.id) {
    return { title: 'Job Not Found' };
  }

  const canonicalUrl = `${AppConfig.baseUrl}/careers/countries/${country.slug}/jobs/${job.id}`;
  const title = `${job.title} in ${country.name} | Baalvion Careers`;
  const description = job.description.substring(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: job.createdAt,
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { slug, jobId } = params;
  const job = await talentService.getJobById(jobId);
  const country = await talentService.getCountryBySlug(slug);

  // Validation
  if (
    !job ||
    !country ||
    job.countryId !== country.id ||
    job.status !== 'published' ||
    (job.publishEndDate && new Date(job.publishEndDate) < new Date())
  ) {
    notFound();
  }

  const department = (await talentService.getDepartments({})).find(
    (d) => d.id === job.departmentId,
  );
  const complianceProfile = await talentService.getComplianceProfile(
    country.complianceProfileId,
  );
  const applyUrl = `/careers/application/${country.slug}?jobId=${job.id}`;

  // Generate structured data using our utility
  const structuredData = generateJobPostingStructuredData(
    job,
    AppConfig.baseUrl,
  );

  return (
    <>
      <TrackViewedJob jobId={job.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="bg-background">
        <JobHeader
          job={job}
          country={country}
          departmentName={department?.name}
          applyUrl={applyUrl}
        />

        <div className="container mx-auto py-16 lg:py-24 max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-12 items-start">
            <div className="lg:col-span-3 space-y-12">
              <JobSection title="Job Overview">
                <p className="text-muted-foreground">{job.description}</p>
              </JobSection>
              <JobSection title="Responsibilities">
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {job.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </JobSection>
              <JobSection title="Qualifications">
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  {job.qualifications.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </JobSection>

              <Separator />

              <JobCompensationSection job={job} />

              {complianceProfile && (
                <JobComplianceSection compliance={complianceProfile} />
              )}
            </div>
            <aside className="lg:col-span-1 lg:sticky top-24">
              <JobMetaSidebar
                job={job}
                departmentName={department?.name}
                countryName={country.name}
                applyUrl={applyUrl}
              />
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
