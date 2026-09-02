'use client';

import React, { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { User, UserRole } from '@/types/contracts';

// This provider now simulates a default logged-in user for UI development.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    // For the UI-only phase, we'll create a default mock user on load.
    // This simulates a user being logged in.
    setIsLoading(true);
    const mockUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      fullName: 'Admin User',
      email: 'admin@baalvion.com',
      role: 'SUPER_ADMIN',
      avatarUrl: 'https://github.com/shadcn.png',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUser(mockUser);
    setIsLoading(false);
  }, [setUser, setIsLoading]);

  return <>{children}</>;
};
