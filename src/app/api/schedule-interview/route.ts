
import { NextRequest, NextResponse } from "next/server";
import { calendarService } from "@/services/mock/calendar.service";

export async function POST(request: NextRequest) {
  try {
    const { candidateName, jobTitle, scheduledAt } = await request.json();
    if (!candidateName || !jobTitle || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields: candidateName, jobTitle, scheduledAt" }, { status: 400 });
    }

    const event = await calendarService.scheduleInterview({ candidateName, jobTitle, scheduledAt: new Date(scheduledAt) });
    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
