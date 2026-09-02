
import { AppError } from './error.types';

export function normalizeError(error: unknown): AppError {
  // If it's already a correctly formatted AppError, return it.
  if (error && typeof error === 'object' && 'type' in error && 'message' in error) {
    return error as AppError;
  }
  
  // Handle native Error objects, which fetch and other libraries might throw.
  if (error instanceof Error) {
    // Network errors (e.g., failed to fetch)
    if (error.message.toLowerCase().includes('failed to fetch') || error.message.toLowerCase().includes('network request failed')) {
      return {
        type: 'NETWORK',
        message: 'A network error occurred. Please check your connection and try again.',
        retryable: true,
      };
    }
    
    // Check for status property attached by our API client
    const status = (error as any).status as number;
    const message = (error as any).message || 'An error occurred.';
    const details = (error as any).details;

    if (status) {
       if (status === 401) {
        return { type: 'AUTH', status, message: message || 'Authentication failed. Please log in again.', retryable: false };
      }
      if (status === 403) {
        return { type: 'PERMISSION', status, message: message || "You don't have permission to perform this action.", retryable: false };
      }
      if (status === 404) {
        return { type: 'NOT_FOUND', status, message: message || 'The requested resource was not found.', retryable: false };
      }
      if (status === 422) {
        return { type: 'VALIDATION', status, message: message || 'There were validation errors.', details, retryable: false };
      }
      if (status >= 500) {
        return { type: 'SERVER', status, message: 'An unexpected server error occurred. Please try again later.', retryable: true };
      }
    }
  }

  // Fallback for all other cases (e.g., strings thrown as errors)
  return {
    type: 'UNKNOWN',
    message: typeof error === 'string' ? error : 'An unknown error occurred. Please try again.',
    details: error,
    retryable: true,
  };
}
