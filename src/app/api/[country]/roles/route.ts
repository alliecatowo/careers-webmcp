
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const { country } = params;

  // Example response (replace with your real logic)
  return NextResponse.json({
    success: true,
    country
  });
}
