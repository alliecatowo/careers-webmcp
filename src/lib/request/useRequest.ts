'use client';

import { useState, useCallback, useEffect } from 'react';
import { RequestState, RequestStatus } from './request.types';
import { AppError } from '@/lib/errors/error.types';
import { normalizeError } from '@/lib/errors/error.normalizer';
import { useGlobalRequest } from './request.context';

interface UseRequestReturn<T> {
  execute: (...args: any[]) => Promise<T | undefined>;
  reset: () => void;
  data: T | undefined;
  error: AppError | undefined;
  status: RequestStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useRequest<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  autoExecuteDeps?: any[]
): UseRequestReturn<T> {
  const [state, setState] = useState<RequestState<T>>({ status: 'idle' });
  const { incrementRequestCount, decrementRequestCount } = useGlobalRequest();

  const execute = useCallback(async (...args: any[]) => {
    incrementRequestCount();
    setState({ status: 'loading' });
    try {
      const data = await asyncFn(...args);
      setState({ status: 'success', data });
      return data;
    } catch (err) {
      const error = normalizeError(err);
      setState({ status: 'error', error });
      return undefined;
    } finally {
      decrementRequestCount();
    }
  }, [asyncFn, incrementRequestCount, decrementRequestCount]);

  const reset = useCallback(() => {
    setState({ status: 'idle' });
  }, []);

  // Use stringified deps or a boolean flag inside useEffect to conditionally fire on mount/deps change
  useEffect(() => {
    if (autoExecuteDeps) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, autoExecuteDeps ? autoExecuteDeps : []);

  return {
    execute,
    reset,
    data: state.data,
    error: state.error,
    status: state.status,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}
