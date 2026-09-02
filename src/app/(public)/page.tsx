import type { Metadata } from 'next';
import { CareersLanding, getCareersLandingMetadata } from './careers/careers-landing';

export async function generateMetadata(): Promise<Metadata> {
  return getCareersLandingMetadata('/');
}

export default async function HomePage() {
  return <CareersLanding />;
}

