'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { ToastProvider } from '@/components/system/Toast/ToastProvider';
import { NetworkListener } from '@/components/system/NetworkListener';
import { RequestProvider } from '@/lib/request/request.context';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { UIProvider } from '@/context/UIContext';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UIProvider>
          <RequestProvider>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
              <NetworkListener />
            </ToastProvider>
          </RequestProvider>
        </UIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
