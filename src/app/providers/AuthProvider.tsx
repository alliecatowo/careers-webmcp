'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useSessionStore } from '@/domain/session/session.store';
import { User } from '@/types/contracts';

/**
 * Bridges the canonical candidate session (src/domain/session) into the
 * upstream auth store so upstream guards/components (ProtectedRoute, UserNav)
 * keep working unchanged. The site starts signed OUT; the human signs in via
 * "Continue as Avery Chen". Upstream's mock admin login still writes the auth
 * store directly and is untouched.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setUser, setIsLoading } = useAuthStore();
  const candidate = useSessionStore((s) => s.candidate);
  const status = useSessionStore((s) => s.status);

  useEffect(() => {
    if (status !== 'ready') {
      setIsLoading(true);
      return;
    }
    if (candidate) {
      const user: User = {
        id: candidate.id,
        name: candidate.displayName,
        fullName: candidate.displayName,
        email: candidate.email,
        role: 'CANDIDATE',
        avatarUrl: '',
        isActive: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      };
      setUser(user);
    } else {
      // Only clear when the previous user was a candidate session; leave upstream admin mock logins alone.
      const current = useAuthStore.getState().user;
      if (!current || current.role === 'CANDIDATE') setUser(null);
      setIsLoading(false);
    }
  }, [candidate, status, setUser, setIsLoading]);

  return <>{children}</>;
};
