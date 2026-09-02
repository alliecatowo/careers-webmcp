
import { NextRequest, NextResponse } from 'next/server';
import { atsWebhookHandler } from '@/integrations/ats/ATSWebhookHandler';

// This route handles incoming webhooks from various ATS providers.
// The [provider] dynamic segment allows us to identify the source (e.g., 'greenhouse', 'lever').

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider: providerName } = params;
  const rawPayload = await request.text(); // Read as text to validate signature
  const signature = request.headers.get('X-Signature-Header'); // Example header

  try {
    const result = await atsWebhookHandler.processWebhook({
      providerName,
      signature: signature || '',
      payload: rawPayload,
    });

    if (result.success) {
      return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error: any) {
    console.error(`[ATS Webhook] Error processing webhook for ${providerName}:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
