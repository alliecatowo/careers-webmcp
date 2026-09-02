import { UserRole } from '@/lib/access/access.types';

export type Role = UserRole;

export interface User {
    id: string;
    name: string;
    fullName?: string;
    email: string;
    phone?: string;
    role: Role;
    avatarUrl?: string;
    createdAt?: string; // Added for user management table
}
