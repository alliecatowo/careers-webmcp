
'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/contracts';

const getMockUserRoleByEmail = (email: string): UserRole => {
  const normalizedEmail = email.trim().toLowerCase();

  const roleByEmail: Record<string, UserRole> = {
    'admin@baalvion.com': 'SUPER_ADMIN',
    'recruiter@baalvion.com': 'RECRUITER',
    'manager@baalvion.com': 'ADMIN',
    'elon@tesla.com': 'INTERVIEWER',
    'finance@acme.inc': 'FINANCE',
    'elena.rodriguez@example.com': 'CANDIDATE',
  };

  return roleByEmail[normalizedEmail] ?? 'CANDIDATE';
};

export const useAuth = () => {
  const { user, isLoading, setUser, setIsLoading, setRole } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    // This is a mock login, real logic would be here
    setIsLoading(true);
    const role = getMockUserRoleByEmail(email);
    const mockUser = {
        id: '1',
        name: 'Test User',
        email,
        role,
        isActive: true,
        avatarUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    setUser(mockUser);
    setRole(role);
    router.push(role === 'CANDIDATE' ? '/my-account' : '/dashboard');
    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    login,
    logout,
    setRole,
    isAuthenticated: !!user,
    role: user?.role
  };
};
