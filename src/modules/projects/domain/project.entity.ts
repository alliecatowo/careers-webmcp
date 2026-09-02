

export type ProjectStatus = 'OPEN' | 'ACTIVE' | 'COMPLETED' | 'DRAFT' | 'GOVERNANCE_REVIEW';

export interface ProjectRole {
    id: string;
    title: string;
    compensation: string;
    slots: number;
}

export type { Project } from '@/types/contracts';
