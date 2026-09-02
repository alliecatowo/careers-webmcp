
import { ATSProvider } from '../ATSProvider';
import { ATSApplicationPayload, ATSJobPayload, ATSResponse } from '../types';
import { atsConfig } from '../mockATSData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class LeverProvider implements ATSProvider {
  public name = 'lever';
  private config = atsConfig.providerConfigs.lever;

  private validateSignature(signature: string): boolean {
    return signature === `mock_signature_for_${this.config.webhookSignatureKey}`;
  }

  async pushJob(job: ATSJobPayload): Promise<ATSResponse> {
    await delay(250);
    console.log(`[Lever] Pushing job posting: ${job.title}`);

    if (Math.random() < 0.05) {
      console.error('[Lever] Mock API Error: Timeout.');
      return { success: false, error: 'TIMEOUT' };
    }

    const externalId = `lever_${Date.now()}`;
    console.log(`[Lever] Job created with external ID: ${externalId}`);
    return { success: true, externalId };
  }

  async pushApplication(application: ATSApplicationPayload): Promise<ATSResponse> {
    await delay(350);
    console.log(`[Lever] Pushing application for ${application.candidate.firstName} to job ${application.internalJobId}`);

    const externalId = `lever_app_${Date.now()}`;
    return { success: true, externalId };
  }

  async fetchJobStatus(externalId: string): Promise<string> {
    await delay(150);
    return 'published'; // Mock response
  }

  async fetchApplicationStatus(externalId: string): Promise<string> {
    await delay(180);
    return 'on-site-interview'; // Mock response
  }
  
  async handleWebhook(payload: { signature: string, body: any }): Promise<{ success: boolean; message: string; internalStatus?: string }> {
    console.log('[Lever] Handling webhook...');
    // if (!this.validateSignature(payload.signature)) {
    //   throw new Error('Invalid webhook signature.');
    // }

    const eventType = payload.body?.event;
    if (eventType === 'applicationStageChange') {
        const externalStatus = payload.body?.data?.toStage?.text;
        if(externalStatus) {
            return { success: true, message: 'Stage changed.', internalStatus: externalStatus };
        }
    }
    
    return { success: false, message: 'Webhook event not relevant.' };
  }
}
