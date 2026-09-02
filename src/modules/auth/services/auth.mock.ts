
import { AuthService } from './auth.service';
import { AuthUser } from '../domain/user.types';

let mockUser: AuthUser | null = null;

export const MockAuthService: AuthService = {
  async login(email, password) {
    mockUser = {
      id: '1',
      name: 'Admin User',
      email,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      accessToken: 'mock-token',
    };
    return mockUser;
  },

  async logout() {
    mockUser = null;
  },

  async getCurrentUser() {
    return mockUser;
  },
};
