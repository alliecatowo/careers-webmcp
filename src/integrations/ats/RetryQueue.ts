
import { ATSSyncPayload } from './types';
import { atsSyncService } from './ATSSyncService';

interface RetryQueueItem {
  id: string;
  providerName: string;
  entityType: 'JOB' | 'APPLICATION';
  entityId: string;
  payload: ATSSyncPayload;
  attemptCount: number;
  lastAttempt: string;
  status: 'QUEUED' | 'FAILED';
}

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 1000;

class MockRetryQueue {
  private queue: RetryQueueItem[] = [];

  /**
   * Adds a failed synchronization task to the retry queue.
   * @param item - The details of the failed task.
   */
  public enqueue(item: Omit<RetryQueueItem, 'id' | 'attemptCount' | 'lastAttempt' | 'status'>): void {
    const newItem: RetryQueueItem = {
      ...item,
      id: `retry_${Date.now()}`,
      attemptCount: 1,
      lastAttempt: new Date().toISOString(),
      status: 'QUEUED',
    };
    this.queue.push(newItem);
    console.log(`[RetryQueue] Enqueued ${item.entityType} ${item.entityId} for provider ${item.providerName}.`);
    this.scheduleRetry(newItem);
  }

  /**
   * Schedules a retry attempt for a queued item with exponential backoff.
   * @param item - The queue item to schedule.
   */
  private scheduleRetry(item: RetryQueueItem): void {
    if (item.attemptCount >= MAX_RETRIES) {
      item.status = 'FAILED';
      console.error(`[RetryQueue] FINAL FAILURE for ${item.entityType} ${item.entityId}. Moving to dead-letter queue.`);
      // In a real system, you'd move this to a persistent "dead-letter" store for manual review.
      return;
    }

    const delay = INITIAL_DELAY_MS * Math.pow(2, item.attemptCount);
    console.log(`[RetryQueue] Scheduling retry #${item.attemptCount + 1} in ${delay}ms for ${item.entityType} ${item.entityId}.`);
    
    setTimeout(() => {
      this.processItem(item);
    }, delay);
  }

  /**
   * Processes a single item from the queue, attempting to re-sync it.
   * @param item - The queue item to process.
   */
  private async processItem(item: RetryQueueItem): Promise<void> {
    console.log(`[RetryQueue] Retrying sync for ${item.entityType} ${item.entityId}...`);
    item.lastAttempt = new Date().toISOString();
    item.attemptCount += 1;

    try {
        let success = false;
        // In a real app, you would not call the sync service this way.
        // Instead, the sync service would have a direct push method.
        // This is simplified for the mock.
        if (item.entityType === 'JOB') {
            // Re-run the logic that would push the job.
            // For simplicity, we are assuming a generic re-sync function exists.
            // await atsSyncService.resyncJob(item.payload);
            console.warn("[RetryQueue] Mock resync for JOB successful.");
            success = true; // Assume success for mock
        } else if (item.entityType === 'APPLICATION') {
            // await atsSyncService.resyncApplication(item.payload);
            console.warn("[RetryQueue] Mock resync for APPLICATION successful.");
            success = true; // Assume success for mock
        }
      
        if (success) {
            // Remove from queue on success
            this.queue = this.queue.filter(q => q.id !== item.id);
            console.log(`[RetryQueue] SUCCESS on retry for ${item.entityType} ${item.entityId}. Removed from queue.`);
        } else {
             // This case shouldn't be hit if errors are thrown, but as a fallback
             this.scheduleRetry(item);
        }

    } catch (error) {
      console.error(`[RetryQueue] FAILED retry for ${item.entityType} ${item.entityId}.`);
      this.scheduleRetry(item);
    }
  }
}

export const atsRetryQueue = new MockRetryQueue();
