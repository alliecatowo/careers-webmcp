
import { Document, DocumentType, DocumentStatus } from '@/types';
import { adapter } from './adapter';

interface DocumentServiceAdapter {
    getDocumentsForCandidate(candidateId: string): Promise<Document[]>;
    getAllDocuments(): Promise<Document[]>;
    requestDocumentDeletion(documentId: string): Promise<{ success: boolean }>;
    updateDocumentStatus(documentId: string, status: 'VERIFIED' | 'REJECTED'): Promise<{ success: boolean }>;
    approveDeletion(documentId: string): Promise<{ success: boolean }>;
    uploadDocument(data: {
        candidateId: string,
        file: File,
        documentType: DocumentType,
        country: string,
        issueDate?: string
    }): Promise<Document>;
}

export const documentService: DocumentServiceAdapter = adapter;
