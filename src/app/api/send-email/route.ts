
import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/services/mock/email.service";

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body } = await request.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 });
    }

    const email = await emailService.sendEmail(to, subject, body);
    return NextResponse.json(email, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
