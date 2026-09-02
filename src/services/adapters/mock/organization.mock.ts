import { Organization } from '@/features/organization/types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const mockOrganizations: Organization[] = [
    {
        id: 'org_acme',
        name: 'Acme Inc.',
        slug: 'acme-inc',
        plan: 'ENTERPRISE',
        createdAt: new Date('2022-01-01').toISOString(),
    },
    {
        id: 'org_stark',
        name: 'Stark Industries',
        slug: 'stark-industries',
        plan: 'PRO',
        createdAt: new Date('2023-05-10').toISOString(),
    },
     {
        id: 'org_default',
        name: 'My Workspace',
        slug: 'my-workspace',
        plan: 'FREE',
        createdAt: new Date('2024-01-01').toISOString(),
    }
];

export const organizationMockService = {
    async getUserOrganizations(userId: string): Promise<Organization[]> {
        await delay(200);
        // In a real app, you'd fetch organizations based on the user's membership.
        // Here, we return all mocks for any user.
        return mockOrganizations;
    }
};
