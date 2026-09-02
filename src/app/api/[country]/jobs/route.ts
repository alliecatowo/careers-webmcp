
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  const { country } = params;

  return NextResponse.json({
    success: true,
    country
  });
}
