
'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType } from './types';
import { ToastContainer } from './ToastContainer';

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 5000;

type ToastOptions = {
  type: ToastType;
  title?: string;
  description: string;
  duration?: number;
};

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now().toString() + Math.random();
    const newToast: ToastMessage = { id, ...options };

    setToasts(currentToasts => [newToast, ...currentToasts].slice(0, MAX_TOASTS));

    const duration = options.duration || DEFAULT_DURATION;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
