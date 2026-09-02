'use client';

import { useState } from 'react';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  return {
    toasts,
    toast: (options: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
      action?: React.ReactNode;
    }) => {
      console.log('Toast:', options.title, options.description);
      const newToast: ToastData = { id: Date.now().toString(), ...options };
      setToasts(prev => [...prev, newToast]);
    },
  };
}
