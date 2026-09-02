'use client';
/**
 * Feature-detects `document.modelContext` and, when present, registers the
 * careers tools exactly once per page load. Renders nothing, never throws,
 * and the site remains fully usable when WebMCP is unavailable.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setNavigator } from './navigation';
import { registerCareersTools, getToolDefinitions } from './register';

export function WebMCPProvider() {
  const router = useRouter();

  useEffect(() => {
    setNavigator((path: string) => router.push(path));
    return () => setNavigator(null);
  }, [router]);

  useEffect(() => {
    if (typeof document === 'undefined' || !document.modelContext) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[webmcp] document.modelContext not available; skipping tool registration.');
      }
      return;
    }

    const controller = new AbortController();
    registerCareersTools(document.modelContext, { signal: controller.signal })
      .then(() => {
        console.info(`[webmcp] registered ${getToolDefinitions().length} careers tools`);
      })
      .catch((err) => {
        // Never let a registration failure break the normal site.
        if (process.env.NODE_ENV !== 'production') {
          console.debug('[webmcp] tool registration failed', err);
        }
      });

    return () => controller.abort();
  }, []);

  return null;
}
