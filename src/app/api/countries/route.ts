
import { talentService } from '@/services/talent.service';
import { NextRequest } from 'next/server';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  await delay(500);
  
  const { searchParams } = new URL(request.url);
  const isActive = searchParams.get('isActive') === 'true';

  const data = await talentService.getCountries({ isActive });

  return Response.json({ success: true, data, error: null }, { status: 200 });
}
