
import { Application } from './application.types';
import { Candidate } from './candidate.types';
import { User } from './user.types';

export type OfferStatus = 'DRAFT' | 'PENDING' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'REJECTED' | 'EXPIRED';

export interface Offer {
    id: string;
    applicationId: string;
    candidateName?: string;
    position?: string;
    baseSalary: number;
    equityValue: number;
    bonus: number;
    currency: string;
    status: OfferStatus;
    approvals: Approval[];
    createdAt?: string;
}

export interface Approval {
    approverId: string;
    approverName: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    timestamp: Date | null;
}

export interface OfferData {
    application: Application;
    candidate: Candidate;
    offer: Offer | null;
}

export interface OfferFormData {
    baseSalary: number;
    equityValue: number;
    bonus: number;
    currency: string;
}
