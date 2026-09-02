
import type { Metadata } from 'next';
import { CareersLanding, getCareersLandingMetadata } from './careers-landing';

export async function generateMetadata(): Promise<Metadata> {
  return getCareersLandingMetadata('/careers');
}

export default async function CareersLandingPage() {
  return <CareersLanding />;
}
