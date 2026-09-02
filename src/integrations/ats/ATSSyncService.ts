
import { Application, Job } from '@/types';
import { atsMapper } from './ATSMapper';
import { atsRegistry } from './ATSRegistry';
import { atsRetryQueue } from './RetryQueue';
import { ATSIntegrationEvent } from './types';

// Mock logger - in a real app, this would write to a database or logging service.
const integrationEvents: ATSIntegrationEvent[] = [];

async function logEvent(eventData: Omit<ATSIntegrationEvent, 'id' | 'timestamp'>): Promise<void> {
  const event: ATSIntegrationEvent = {
    ...eventData,
    id: `event_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  integrationEvents.push(event);
  console.log('[ATSSyncService] Logged Event:', event);
}

/**
 * Synchronizes a single job to the appropriate country-specific ATS.
 * @param job - The internal Job object.
 */
async function syncJobToATS(job: Job): Promise<void> {
  const provider = atsRegistry.getProviderForCountry(job.countryId);
  if (!provider) {
    await logEvent({ type: 'OUTBOUND_SYNC', entityType: 'JOB', entityId: job.id, provider: 'N/A', status: 'FAILED', error: 'No provider configured for job country.' });
    return;
  }

  const internalJob = atsMapper.normalizeJob(job);
  const payload = atsMapper.mapJobToPayload(internalJob);

  try {
    const response = await provider.pushJob(payload);
    if (response.success) {
      await logEvent({ type: 'OUTBOUND_SYNC', entityType: 'JOB', entityId: job.id, provider: provider.name, status: 'SUCCESS' });
      // In a real app, you would store `response.externalId` on the job document.
    } else {
      throw new Error(response.error || 'Unknown error from provider.');
    }
  } catch (error: any) {
    await logEvent({ type: 'OUTBOUND_SYNC', entityType: 'JOB', entityId: job.id, provider: provider.name, status: 'FAILED', error: error.message });
    // Add to retry queue on failure
    atsRetryQueue.enqueue({ providerName: provider.name, entityType: 'JOB', entityId: job.id, payload });
  }
}

/**
 * Synchronizes a single application to the appropriate ATS.
 * @param application - The internal Application object.
 */
async function syncApplicationToATS(application: Application): Promise<void> {
  const job = {} as Job; // Placeholder: Fetch job from jobService using application.jobId
  const provider = atsRegistry.getProviderForCountry('IN'); // Placeholder
  if (!provider) {
    await logEvent({ type: 'OUTBOUND_SYNC', entityType: 'APPLICATION', entityId: application.id, provider: 'N/A', status: 'FAILED', error: 'No provider configured for job country.' });
    return;
  }

  const internalApp = atsMapper.normalizeApplication(application);
  const payload = atsMapper.mapApplicationToPayload(internalApp);

  try {
    const response = await provider.pushApplication(payload);
    if (response.success) {
      await logEvent({ type: 'OUTBOUND_SYNC', entityType: 'APPLICATION', entityId: application.id, provider: provider.name, status: 'SUCCESS' });
    } else {
      throw new Error(response.error || 'Unknown application sync error.');
    }
  } catch (error: any) {
    await logEvent({ type: 'OUTBOUND_SYNC', entityType: 'APPLICATION', entityId: application.id, provider: provider.name, status: 'FAILED', error: error.message });
    atsRetryQueue.enqueue({ providerName: provider.name, entityType: 'APPLICATION', entityId: application.id, payload });
  }
}

export const atsSyncService = {
  syncJobToATS,
  syncApplicationToATS,
};
