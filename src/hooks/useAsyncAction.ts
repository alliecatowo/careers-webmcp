'use client';

import { useState } from 'react';
import { useToast } from '@/components/system/Toast/useToast';
import { normalizeError } from '@/lib/errors/error.normalizer';
import { AppError } from '@/lib/errors/error.types';

interface AsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

export function useAsyncAction<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options?: AsyncActionOptions<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const run = async (...args: any[]) => {
    setIsLoading(true);
    try {
      const result = await asyncFn(...args);
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      return result;
    } catch (err) {
      const error = normalizeError(err);
      if (options?.onError) {
        options.onError(error);
      } else {
        showToast({
          type: 'error',
          title: 'Action Failed',
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    run,
    isLoading,
  };
}
