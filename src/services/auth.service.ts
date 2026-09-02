
import { adapter } from './adapter';

export const authService = {
  login: (email: string, password: string) => adapter.login(email, password),
  logout: () => adapter.logout(),
  checkSession: () => adapter.checkSession(),
};
