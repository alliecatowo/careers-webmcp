import { MetadataRoute } from 'next';
import { AppConfig } from '@/config/app.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/my-account/',
          '/api/',
          '/dashboard/',
          '/unauthorized/',
          '/_next/',
          '/apply/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/my-account/',
          '/api/',
          '/dashboard/',
          '/unauthorized/',
          '/apply/',
        ],
      },
    ],
    sitemap: `${AppConfig.baseUrl}/sitemap.xml`,
    host: AppConfig.baseUrl,
  };
}
