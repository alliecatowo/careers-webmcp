import { NextResponse } from "next/server";
import { calendarService } from "@/services/mock/calendar.service";

export async function GET() {
  try {
    const events = await calendarService.getScheduledInterviews();
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}
