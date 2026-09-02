
import { AuthService } from './auth.service';

export const ApiAuthService: AuthService = {
  async login(email, password) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async logout() {
    await fetch('/api/logout', { method: 'POST' });
  },

  async getCurrentUser() {
    const res = await fetch('/api/me');
    if (!res.ok) return null;
    return res.json();
  },
};
