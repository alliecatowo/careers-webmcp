import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/app/providers/AppProvider';
import { AppConfig } from '@/config/app.config';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(AppConfig.baseUrl),
  title: {
    default: 'TalentOS by Baalvion | The OS for Modern Recruitment',
    template: '%s | TalentOS by Baalvion',
  },
  description:
    'TalentOS is an intelligent, global talent acquisition platform designed to connect exceptional talent with borderless opportunity.',
  openGraph: {
    title: 'TalentOS by Baalvion',
    description: 'The Operating System for Modern Recruitment.',
    type: 'website',
    url: AppConfig.baseUrl,
    images: [`/og-image.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TalentOS by Baalvion',
    description: 'The Operating System for Modern Recruitment.',
    images: [`/og-image.png`],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TalentOS by Baalvion',
  url: AppConfig.baseUrl,
  logo: `${AppConfig.baseUrl}/logo.png`,
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      </head>
      <body className='font-sans antialiased'>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
