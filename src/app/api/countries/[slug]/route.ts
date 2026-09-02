
import { talentService } from '@/services/talent.service';
import { NextRequest } from 'next/server';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  await delay(500);
  const { slug } = params;
  const country = await talentService.getCountryBySlug(slug);

  if (!country) {
    return Response.json({ success: false, data: null, error: 'Country not found' }, { status: 404 });
  }

  return Response.json({ success: true, data: country, error: null }, { status: 200 });
}
