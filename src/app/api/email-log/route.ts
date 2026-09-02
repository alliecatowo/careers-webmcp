
import { NextResponse } from "next/server";
import { emailService } from "@/services/mock/email.service";

export async function GET() {
  try {
    const emails = await (emailService as any).getEmailLog();
    return NextResponse.json({ success: true, data: emails.slice(0, 10), error: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch email log" }, { status: 500 });
  }
}
