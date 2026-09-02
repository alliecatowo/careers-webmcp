
import { ATSApplicationPayload, ATSJobPayload, ATSResponse } from './types';

/**
 * Defines the standard contract for any ATS provider integration.
 * Each provider (e.g., Greenhouse, Lever) must implement this interface
 * to be compatible with the integration system.
 */
export interface ATSProvider {
  /**
   * The unique name of the ATS provider (e.g., "greenhouse", "lever").
   */
  name: string;

  /**
   * Pushes a job posting to the external ATS.
   * @param job - The standardized job payload.
   * @returns A promise that resolves with the ATS's response, including the external ID.
   */
  pushJob(job: ATSJobPayload): Promise<ATSResponse>;

  /**
   * Pushes a candidate application to the external ATS for a specific job.
   * @param application - The standardized application payload.
   * @returns A promise that resolves with the ATS's response.
   */
  pushApplication(application: ATSApplicationPayload): Promise<ATSResponse>;

  /**
   * Fetches the current status of a job from the external ATS.
   * Used for polling-based synchronization.
   * @param externalId - The job's ID in the external ATS.
   * @returns A promise that resolves with the job's status string from the ATS.
   */
  fetchJobStatus(externalId: string): Promise<string>;

  /**
   * Fetches the current status of an application from the external ATS.
   * @param externalId - The application's ID in the external ATS.
   * @returns A promise that resolves with the application's status string from the ATS.
   */
  fetchApplicationStatus(externalId: string): Promise<string>;

  /**
   * Validates and processes an incoming webhook payload from the ATS.
   * @param payload - The raw webhook payload and signature.
   * @returns A promise that resolves when processing is complete.
   */
  handleWebhook(payload: { signature: string, body: unknown }): Promise<{ success: boolean; message: string; internalStatus?: string }>;
}
