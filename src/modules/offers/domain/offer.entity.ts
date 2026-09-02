import { z } from 'zod';
import { Candidate, Application } from '@/types';
import { OfferStatus } from '@/types/offer.types';

export const offerStatuses = ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'] as const;
export type { OfferStatus };

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Approval {
    approverId: string;
    approverName: string;
    status: ApprovalStatus;
    timestamp: Date | null;
}

export interface Offer {
    id: string;
    applicationId: string;
    baseSalary: number;
    equityValue: number;
    bonus: number;
    currency: string;
    status: OfferStatus;
    approvals: Approval[];
    // Enriched properties for table views
    candidateName?: string;
    position?: string;
    createdAt?: string;
    validUntil?: string;
}

export interface OfferData {
    application: Application;
    candidate: Candidate;
    offer: Offer | null;
}


export const offerFormSchema = z.object({
    baseSalary: z.coerce.number().min(1, "Base salary is required."),
    equityValue: z.coerce.number().min(0, "Equity value must be positive."),
    bonus: z.coerce.number().min(0, "Bonus must be positive."),
    currency: z.string().min(3, "Currency is required."),
});

export type OfferFormData = z.infer<typeof offerFormSchema>;
