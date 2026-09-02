
import { ATSProvider } from '../ATSProvider';
import { ATSApplicationPayload, ATSJobPayload, ATSResponse } from '../types';
import { atsConfig } from '../mockATSData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export class GreenhouseProvider implements ATSProvider {
  public name = 'greenhouse';
  private config = atsConfig.providerConfigs.greenhouse;

  private validateSignature(signature: string): boolean {
    // In a real app, you would use crypto to create an HMAC and compare it.
    return signature === `mock_signature_for_${this.config.webhookSignatureKey}`;
  }

  async pushJob(job: ATSJobPayload): Promise<ATSResponse> {
    await delay(300);
    console.log(`[Greenhouse] Pushing job: ${job.title}`);
    
    // Simulate random failure
    if (Math.random() < 0.1) {
      console.error('[Greenhouse] Mock API Error: Failed to create job.');
      return { success: false, error: 'API_LIMIT_EXCEEDED' };
    }

    const externalId = `gh_${Date.now()}`;
    console.log(`[Greenhouse] Job created with external ID: ${externalId}`);
    return { success: true, externalId };
  }

  async pushApplication(application: ATSApplicationPayload): Promise<ATSResponse> {
    await delay(400);
    console.log(`[Greenhouse] Pushing application for ${application.candidate.email} to job ${application.internalJobId}`);

    if (application.candidate.email.includes('fail')) {
      console.error('[Greenhouse] Mock API Error: Invalid candidate data.');
      return { success: false, error: 'VALIDATION_ERROR' };
    }

    const externalId = `gh_app_${Date.now()}`;
    return { success: true, externalId };
  }

  async fetchJobStatus(externalId: string): Promise<string> {
    await delay(200);
    return 'open'; // Mock response
  }

  async fetchApplicationStatus(externalId: string): Promise<string> {
    await delay(200);
    const statuses = ['screen', 'technical_interview', 'final_interview', 'offer'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  async handleWebhook(payload: { signature: string, body: any }): Promise<{ success: boolean; message: string; internalStatus?: string }> {
    console.log('[Greenhouse] Handling webhook...');
    // if (!this.validateSignature(payload.signature)) {
    //   throw new Error('Invalid webhook signature.');
    // }

    // Mock parsing logic
    const action = payload.body?.action;
    if (action === 'application_stage_changed') {
      const externalStatus = payload.body?.payload?.application?.new_stage?.name;
      if (externalStatus) {
        return { success: true, message: 'Stage change processed.', internalStatus: externalStatus };
      }
    }
    
    return { success: false, message: 'Webhook event not relevant or malformed.' };
  }
}
