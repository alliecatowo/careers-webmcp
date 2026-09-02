
import { getApplicationById } from '@/mocks/talent-platform/applications.mock';
import { NextRequest } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await delay(500);
  const { id } = params;
  const application = getApplicationById(id);

  if (!application) {
    return Response.json({ success: false, data: null, error: 'Application not found' }, { status: 404 });
  }

  return Response.json({ success: true, data: application, error: null }, { status: 200 });
}
