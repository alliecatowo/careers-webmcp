'use client';

import { ReactNode, Suspense } from 'react';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { ToastProvider } from '@/components/system/Toast/ToastProvider';
import { NetworkListener } from '@/components/system/NetworkListener';
import { RequestProvider } from '@/lib/request/request.context';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { UIProvider } from '@/context/UIContext';
import { PageContextBridge } from '@/domain/ui-context/bridges';
import { WebMCPProvider } from '@/webmcp/WebMCPProvider';
import { AgentPresenceLayer } from '@/webmcp/presence';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <UIProvider>
          <RequestProvider>
            <ToastProvider>
              <AuthProvider>
                {children}
                {/* Router state -> ui-context store (read by careers_get_context). */}
                <Suspense fallback={null}>
                  <PageContextBridge />
                </Suspense>
                {/* Registers WebMCP tools when document.modelContext exists; no-op otherwise. */}
                <Suspense fallback={null}>
                  <WebMCPProvider />
                </Suspense>
                {/* Transient echo of agent activity. Renders nothing until a tool runs. */}
                <AgentPresenceLayer />
              </AuthProvider>
              <NetworkListener />
            </ToastProvider>
          </RequestProvider>
        </UIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
