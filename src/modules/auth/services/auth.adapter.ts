
import { MockAuthService } from './auth.mock';
import { ApiAuthService } from './auth.api';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const authService = USE_MOCK
  ? MockAuthService
  : ApiAuthService;
