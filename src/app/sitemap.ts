import { MetadataRoute } from 'next';
import { AppConfig } from '@/config/app.config';
import { talentService } from '@/services/talent.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = AppConfig.baseUrl;

  // Core static routes with proper priorities and change frequencies
  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }[] = [
    { path: '', changeFrequency: 'daily', priority: 1.0 }, // Homepage
    { path: '/careers', changeFrequency: 'daily', priority: 0.9 },
    { path: '/careers/open-positions', changeFrequency: 'daily', priority: 0.9 },
    { path: '/careers/full-time', changeFrequency: 'daily', priority: 0.8 },
    { path: '/careers/part-time', changeFrequency: 'daily', priority: 0.8 },
    { path: '/careers/hiring-process', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/careers/hiring-strategy', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/careers/internship-program', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/careers/life-at-baalvion', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about/diversity', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/about/team', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/products', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/projects', changeFrequency: 'daily', priority: 0.8 },
    { path: '/studio', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/data-protection', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/faqs', changeFrequency: 'monthly', priority: 0.5 },
  ];

  const staticUrls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Dynamically fetch published jobs and active countries
  let countryUrls: MetadataRoute.Sitemap = [];
  let jobUrls: MetadataRoute.Sitemap = [];

  try {
    const [allJobs, allCountries] = await Promise.all([
      talentService.getJobs({ status: 'published' }),
      talentService.getCountries({ isActive: true }),
    ]);

    countryUrls = allCountries.map((country) => ({
      url: `${baseUrl}/careers/countries/${country.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    jobUrls = allJobs.data
      .map((job: any) => {
        const country = allCountries.find((c) => c.id === job.countryId);
        if (!country) return null;
        return {
          url: `${baseUrl}/careers/countries/${country.slug}/jobs/${job.id}`,
          lastModified: new Date(job.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;
  } catch (error) {
    // If dynamic data fails, at least return the static sitemap
    console.error('Error generating dynamic sitemap entries:', error);
  }

  return [...staticUrls, ...countryUrls, ...jobUrls];
}
