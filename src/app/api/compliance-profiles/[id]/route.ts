
import { talentService } from '@/services/talent.service';
import { NextRequest } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await delay(300);
  try {
    const { id } = params;
    const profile = await talentService.getComplianceProfile(id);

    if (!profile) {
      return Response.json({ success: false, data: null, error: 'Compliance profile not found.' }, { status: 404 });
    }

    return Response.json({ success: true, data: profile, error: null }, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return Response.json({ success: false, data: null, error: error.message || 'Failed to fetch compliance profile.' }, { status: 500 });
  }
}
