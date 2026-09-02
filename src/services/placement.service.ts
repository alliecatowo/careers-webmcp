
import { adapter } from './adapter';
import { Placement } from '@/types/placement.types';

export const placementService = {
    getApprovedPlacements: (): Promise<Placement[]> => adapter.getApprovedPlacements(),
    getPendingPlacements: (): Promise<Placement[]> => adapter.getPendingPlacements(),
    approvePlacement: (id: string, updates: { auditLogs: any[] }): Promise<Placement> => adapter.approvePlacement(id, updates),
};
