
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  const { country } = params;

  // Example response (replace with your real logic)
  return NextResponse.json({
    success: true,
    country
  });
}
