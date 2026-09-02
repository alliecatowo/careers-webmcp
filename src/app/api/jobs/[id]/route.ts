
import { talentService } from '@/services/talent.service';
import { NextRequest } from 'next/server';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await delay(500);
  const { id } = params;
  const job = await talentService.getJobById(id);

  if (!job) {
    return Response.json({ success: false, data: null, error: 'Job not found' }, { status: 404 });
  }

  return Response.json({ success: true, data: job, error: null }, { status: 200 });
}
