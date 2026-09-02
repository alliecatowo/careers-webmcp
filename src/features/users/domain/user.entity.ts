
import { UserRole } from '@/lib/access/access.types';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}
