
export const documentTypes = ['RESUME', 'PORTFOLIO', 'OFFER_LETTER', 'SALARY_CERTIFICATE', 'EMPLOYMENT_CERTIFICATE', 'TRAINING_CERTIFICATE', 'ID_PROOF', 'OTHER'] as const;
export type DocumentType = typeof documentTypes[number];

export type DocumentStatus = 'UPLOADED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'DELETION_REQUESTED' | 'DELETED';

export const documentStatuses: DocumentStatus[] = ['UPLOADED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'DELETION_REQUESTED', 'DELETED'];


export interface Document {
    id: string;
    candidateId: string;
    name: string;
    type: DocumentType;
    country: string; // ISO 3166-1 alpha-2 code
    issueDate?: string;
    url: string;
    uploadedAt: Date;
    status: DocumentStatus;
    notes?: string;
}
