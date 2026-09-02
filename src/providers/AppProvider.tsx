
'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { ToastProvider } from '@/components/system/Toast/ToastProvider';
import { NetworkListener } from '@/components/system/NetworkListener';
import { RequestProvider } from '@/lib/request/request.context';
import { ThemeProvider } from '@/context/ThemeContext';
import { UIProvider } from '@/context/UIContext';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RequestProvider>
          <ToastProvider>
            <AuthProvider>
              <UIProvider>
                {children}
              </UIProvider>
            </AuthProvider>
            <NetworkListener />
          </ToastProvider>
        </RequestProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
