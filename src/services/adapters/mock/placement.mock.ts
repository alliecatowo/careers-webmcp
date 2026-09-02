
import { Placement } from '@/types/placement.types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let mockPlacements: Placement[] = [
    { id: 'place-1', studentId: 'stu-002', companyName: 'Infosys', role: 'Developer', approved: true, createdAt: new Date().toISOString(), verifiedByAdminId: '1', auditLogs: [] },
    { id: 'place-2', studentId: 'stu-004', companyName: 'Google', role: 'Software Engineer', approved: true, createdAt: new Date().toISOString(), verifiedByAdminId: '1', auditLogs: [] },
    { id: 'place-3', studentId: 'stu-007', companyName: 'Rohan Mehta', role: 'B.Tech', approved: true, createdAt: new Date().toISOString(), verifiedByAdminId: '1', auditLogs: [] },
    { id: 'place-4', studentId: 'stu-001', companyName: 'TCS', role: 'Software Engineer', approved: false, createdAt: new Date().toISOString(), verifiedByAdminId: '', auditLogs: [] },
    { id: 'place-5', studentId: 'stu-003', companyName: 'Amazon', role: 'SDE Intern', approved: false, createdAt: new Date().toISOString(), verifiedByAdminId: '', auditLogs: [] },
    { id: 'place-6', studentId: 'stu-005', companyName: 'Microsoft', role: 'Data Analyst', approved: false, createdAt: new Date().toISOString(), verifiedByAdminId: '', auditLogs: [] },
];

export const placementMockService = {
  async getPendingPlacements(): Promise<Placement[]> {
    await delay(300);
    return mockPlacements.filter(p => !p.approved);
  },

  async getApprovedPlacements(): Promise<Placement[]> {
    await delay(300);
    return mockPlacements.filter(p => p.approved);
  },

  async approvePlacement(id: string, updates: { auditLogs: any[] }): Promise<Placement> {
    await delay(200);
    const placement = mockPlacements.find(p => p.id === id);
    if (!placement) {
        throw new Error('Placement not found');
    }
    placement.approved = true;
    placement.verifiedByAdminId = 'admin-mock-id';
    placement.auditLogs = [...(placement.auditLogs || []), ...updates.auditLogs];
    return placement;
  }
};
