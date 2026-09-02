
/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];


const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.cdprojektred.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async redirects() {
    return [
      { source: '/diversity', destination: '/about/diversity', permanent: true },
      { source: '/team', destination: '/about/team', permanent: true },
      { source: '/careers/internship', destination: '/careers/internship-program', permanent: true },
      { source: '/admin/jobs/create', destination: '/jobs', permanent: true },
      { source: '/admin/jobs/edit/:jobId', destination: '/jobs', permanent: true },
      { source: '/admin/calendar', destination: '/interviews', permanent: true },
      { source: '/my-account/interviews', destination: '/my-account?tab=interviews', permanent: false },
      { source: '/my-account/offers', destination: '/my-account?tab=offers', permanent: false },
      { source: '/my-account/profile', destination: '/my-account?tab=settings', permanent: false },
      { source: '/my-account/settings', destination: '/my-account?tab=settings', permanent: false },
    ]
  },
  async headers() {
    return [
        {
            source: '/:path*',
            headers: securityHeaders,
        },
    ]
  },
};

module.exports = nextConfig;
