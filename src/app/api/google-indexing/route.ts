import { NextRequest, NextResponse } from 'next/server';
import { notifyGoogle } from '@/lib/googleIndexing';

interface IndexingRequest {
  url: string;
  type: 'URL_UPDATED' | 'URL_DELETED';
}

/**
 * Protected API route for Google Indexing API notifications
 * Requires GOOGLE_INDEXING_SECRET for authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    const secretToken = request.nextUrl.searchParams.get('token');
    const expectedSecret = process.env.GOOGLE_INDEXING_SECRET;

    if (!expectedSecret) {
      console.error('GOOGLE_INDEXING_SECRET environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    // Validate authentication (header or query param)
    const providedSecret = authHeader?.replace('Bearer ', '') || secretToken;

    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    let body: IndexingRequest;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { url, type } = body;

    // Validate required fields
    if (!url || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: url and type' },
        { status: 400 },
      );
    }

    // Validate URL format
    if (!url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'URL must be a valid HTTPS URL' },
        { status: 400 },
      );
    }

    // Validate type
    if (!['URL_UPDATED', 'URL_DELETED'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either URL_UPDATED or URL_DELETED' },
        { status: 400 },
      );
    }

    // Call Google Indexing API
    const result = await notifyGoogle(url, type);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        url,
        type,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: result.message,
        },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error('Google Indexing API route error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// Optional: Add GET method to check API status
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const secretToken = request.nextUrl.searchParams.get('token');
  const expectedSecret = process.env.GOOGLE_INDEXING_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Server not configured' },
      { status: 500 },
    );
  }

  const providedSecret = authHeader?.replace('Bearer ', '') || secretToken;

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    status: 'Google Indexing API endpoint is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
