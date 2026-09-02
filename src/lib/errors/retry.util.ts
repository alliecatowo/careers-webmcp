
import { AppError } from './error.types';
import { normalizeError } from './error.normalizer';

export async function retryAsync<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 500
): Promise<T> {
  let lastError: AppError | undefined;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = normalizeError(error);

      if (!lastError.retryable) {
        throw lastError;
      }
      
      if (i < retries - 1) {
        const backoffDelay = delayMs * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  throw lastError;
}
