
'use client';

import { useEffect, useRef } from 'react';
import { useToast } from './Toast/useToast';

export const NetworkListener = () => {
  const { showToast } = useToast();
  const wasOffline = useRef(typeof window !== 'undefined' ? !window.navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      if (wasOffline.current) {
        showToast({
          type: 'success',
          title: 'You are back online',
          description: 'Your internet connection has been restored.',
        });
      }
      wasOffline.current = false;
    };

    const handleOffline = () => {
      showToast({
        type: 'warning',
        title: 'You are offline',
        description: 'Please check your internet connection. Some features may be unavailable.',
        duration: 10000,
      });
      wasOffline.current = true;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  return null; // This component does not render anything
};
