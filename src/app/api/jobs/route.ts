
import { talentService } from '@/services/talent.service';
import { EmploymentType } from '@/lib/talent-acquisition';
import { NextRequest } from 'next/server';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  await delay(300);
  
  try {
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: searchParams.get('status') as 'published' | 'draft' | undefined,
      visibility: searchParams.get('visibility') as 'public' | undefined,
      countryId: searchParams.get('countryId') || undefined,
      employmentType: searchParams.get('employmentType') as EmploymentType | undefined,
    };
    
    // Remove undefined filters
    Object.keys(filters).forEach(key => (filters as any)[key] === undefined && delete (filters as any)[key]);

    const data = await talentService.getJobs(filters);

    return Response.json({ success: true, data, error: null }, { status: 200 });
  } catch (e) {
      const error = e as Error;
      return Response.json({ success: false, data: null, error: error.message || 'Failed to fetch jobs.' }, { status: 500 });
  }
}
