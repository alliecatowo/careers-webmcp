
import { atsRegistry } from './ATSRegistry';
import { atsStatusMapper } from './ATSStatusMapper';
import { applicationService } from '@/services/application.service';

// Mock logger
const integrationEvents: any[] = [];
async function logEvent(eventData: any) {
  const event = { ...eventData, id: `event_${Date.now()}`, timestamp: new Date().toISOString() };
  integrationEvents.push(event);
  console.log('[ATSWebhookHandler] Logged Event:', event);
}

interface ProcessWebhookParams {
  providerName: string;
  signature: string;
  payload: string; // Raw payload for signature validation
}

/**
 * Handles processing of incoming webhooks from various ATS providers.
 */
async function processWebhook(params: ProcessWebhookParams): Promise<{ success: boolean; error?: string }> {
  const { providerName, signature, payload } = params;

  const provider = atsRegistry.getProvider(providerName);
  if (!provider) {
    const errorMsg = `No provider registered with name: ${providerName}`;
    await logEvent({ type: 'WEBHOOK_EVENT', provider: providerName, status: 'FAILED', error: errorMsg });
    throw new Error(errorMsg);
  }

  try {
    const parsedBody = JSON.parse(payload);
    
    // 1. Delegate validation and parsing to the specific provider
    const result = await provider.handleWebhook({ signature, body: parsedBody });

    if (!result.success || !result.internalStatus) {
      throw new Error(result.message || 'Webhook processing failed at provider level.');
    }
    
    // 2. Map status to internal representation (example assumes application update)
    // The provider's handleWebhook method should return our internal entity ID and the new status
    const { internalEntityId, externalStatus } = parsedBody.payload; // This is a mock structure
    const internalStatus = atsStatusMapper.toInternal(externalStatus, provider.name);

    // 3. Update the internal system's state (e.g., update application status in Firestore)
    // This is a mock update. In a real app, you'd use a service.
    // await applicationService.updateStatus(internalEntityId, internalStatus);
    console.log(`[ATSWebhookHandler] MOCK: Would update application ${internalEntityId} to status ${internalStatus}`);
    
    // 4. Log the successful event
    await logEvent({
      type: 'INBOUND_SYNC',
      provider: provider.name,
      entityType: 'APPLICATION',
      entityId: internalEntityId,
      status: 'SUCCESS',
      details: `Status updated from ${externalStatus} to ${internalStatus}`,
    });

    return { success: true };

  } catch (error: any) {
    await logEvent({ type: 'WEBHOOK_EVENT', provider: providerName, status: 'FAILED', error: error.message });
    return { success: false, error: error.message };
  }
}

export const atsWebhookHandler = {
  processWebhook,
};
