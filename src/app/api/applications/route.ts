import { NextRequest } from 'next/server';
import { applicationMockService } from '@/services/adapters/mock/application.mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This endpoint serves all applications for the admin panel.
export async function GET(request: NextRequest) {
  await delay(500);

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || undefined;

    const result = await applicationMockService.getApplications({ page, limit, search });

    return Response.json({ success: true, data: result, error: null }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    return Response.json({ success: false, data: null, error: errorMessage }, { status: 500 });
  }
}
