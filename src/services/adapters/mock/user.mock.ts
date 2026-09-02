import { SystemUser } from "@/features/users/domain/user.entity";
import { UserRole } from "@/lib/access/access.types";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// This is now the single source of truth for all mock users.
export let mockUsers: (SystemUser & { tenantId: string, phone?: string })[] = [
  {
    id: '1',
    name: 'Super Admin (Acme)',
    email: 'admin@baalvion.com',
    role: 'SUPER_ADMIN',
    createdAt: new Date('2023-01-15T09:00:00Z').toISOString(),
    tenantId: 'org_acme',
    phone: '555-0101',
  },
  {
    id: '2',
    name: 'Recruiter (Acme)',
    email: 'recruiter@baalvion.com',
    role: 'RECRUITER',
    createdAt: new Date('2023-02-20T14:30:00Z').toISOString(),
    tenantId: 'org_acme',
    phone: '555-0102',
  },
  {
    id: '3',
    name: 'Hiring Manager (Stark)',
    email: 'manager@baalvion.com',
    role: 'ADMIN',
    createdAt: new Date('2023-03-10T11:00:00Z').toISOString(),
    tenantId: 'org_stark',
    phone: '555-0103',
  },
  {
    id: '4',
    name: 'Elon Musk (Stark)',
    email: 'elon@tesla.com',
    role: 'INTERVIEWER',
    createdAt: new Date('2023-04-01T18:00:00Z').toISOString(),
    tenantId: 'org_stark',
    phone: '555-0104',
  },
  { 
    id: 'user-candidate', 
    name: 'Elena Rodriguez', 
    email: 'elena.rodriguez@example.com', 
    role: 'CANDIDATE',
    createdAt: new Date('2023-05-01T10:00:00Z').toISOString(),
    tenantId: 'org_acme',
    phone: '555-0105',
  },
  { 
    id: 'user-finance', 
    name: 'John Finance', 
    email: 'finance@acme.inc', 
    role: 'RECRUITER', // In RBAC this would be 'FINANCE'
    createdAt: new Date('2023-05-02T10:00:00Z').toISOString(),
    tenantId: 'org_acme',
    phone: '555-0106'
  },
];

export const userMockService = {
    async getUsers(): Promise<SystemUser[]> {
        await delay(300);
        const tenantId = localStorage.getItem('talent-os-tenant-id');
        if (!tenantId) return [];
        return mockUsers.filter(u => u.tenantId === tenantId);
    },

    async getUserById(id: string): Promise<SystemUser | undefined> {
        await delay(50);
        return mockUsers.find(u => u.id === id);
    },

    async create(user: Omit<SystemUser, 'id' | 'createdAt'>): Promise<SystemUser> {
        await delay(500);
        const tenantId = localStorage.getItem('talent-os-tenant-id');
        if (!tenantId) throw new Error("No active tenant selected");
        
        const newUser: SystemUser & { tenantId: string } = {
            ...user,
            id: `user-${Date.now()}`,
            createdAt: new Date().toISOString(),
            tenantId,
        };
        mockUsers.push(newUser);
        return newUser;
    },

    async update(id: string, updates: Partial<SystemUser>): Promise<SystemUser> {
        await delay(500);
        let updatedUser: (SystemUser & { tenantId: string }) | undefined;
        mockUsers = mockUsers.map((u) => {
            if (u.id === id) {
                updatedUser = { ...u, ...updates } as (SystemUser & { tenantId: string });
                return updatedUser;
            }
            return u;
        });
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return updatedUser;
    },

    async delete(id: string): Promise<void> {
        await delay(500);
        const initialLength = mockUsers.length;
        mockUsers = mockUsers.filter((u) => u.id !== id);
        if (mockUsers.length === initialLength) {
            throw new Error("User not found");
        }
    }
};
