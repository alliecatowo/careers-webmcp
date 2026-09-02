import { type NextRequest, NextResponse } from 'next/server';

/**
 * The middleware function is executed for every request that matches its configured path.
 * This is a standard Next.js middleware file.
 *
 * @param request The incoming request object.
 * @returns A response object.
 */
export function proxy(request: NextRequest) {
  // Placeholder logic: currently allows all requests to pass through.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
