
import { AuthUser } from '../domain/user.types';

export interface AuthService {
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
