
import { talentService } from '@/services/talent.service';
import { NextRequest } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  await delay(300);
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive') === 'true';
    const countryId = searchParams.get('countryId') || undefined;

    const data = await talentService.getDepartments({ isActive, countryId });

    return Response.json({ success: true, data, error: null }, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return Response.json({ success: false, data: null, error: error.message || 'Failed to fetch departments.' }, { status: 500 });
  }
}
