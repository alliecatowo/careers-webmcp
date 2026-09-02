
import { mockDocuments as allMockDocuments } from '@/mocks/documents.mock';
import { Document, DocumentType, DocumentStatus } from '@/types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let mockDocuments: Document[] = [...allMockDocuments];

export const documentMockService = {
    async getDocumentsForCandidate(candidateId: string): Promise<Document[]> {
        await delay(300);
        return mockDocuments.filter(doc => doc.candidateId === candidateId && doc.status !== 'DELETED');
    },

    async getAllDocuments(): Promise<Document[]> {
        await delay(300);
        return [...mockDocuments].sort((a,b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    },
    
    async updateDocumentStatus(documentId: string, status: 'VERIFIED' | 'REJECTED'): Promise<{ success: boolean }> {
        await delay(400);
        const docIndex = mockDocuments.findIndex(d => d.id === documentId);
        if (docIndex > -1) {
            mockDocuments[docIndex].status = status;
        }
        return { success: true };
    },

    async requestDocumentDeletion(documentId: string): Promise<{ success: boolean }> {
        await delay(500);
        const docIndex = mockDocuments.findIndex(d => d.id === documentId);
        if (docIndex > -1) {
            mockDocuments[docIndex].status = 'DELETION_REQUESTED';
            console.log(`Deletion requested for document ${documentId}`);
        }
        return { success: true };
    },
    
    async approveDeletion(documentId: string): Promise<{ success: boolean }> {
        await delay(400);
        const docIndex = mockDocuments.findIndex(d => d.id === documentId);
        if (docIndex > -1) {
            mockDocuments[docIndex].status = 'DELETED';
        }
        return { success: true };
    },

    async uploadDocument(data: {
        candidateId: string,
        file: File,
        documentType: DocumentType,
        country: string,
        issueDate?: string
    }): Promise<Document> {
        await delay(800);
        const newDoc: Document = {
            id: `doc-${Date.now()}`,
            candidateId: data.candidateId,
            name: data.file.name,
            type: data.documentType,
            country: data.country,
            issueDate: data.issueDate,
            url: '#', // Mock URL
            uploadedAt: new Date(),
            status: 'PENDING_VERIFICATION',
        };
        mockDocuments.unshift(newDoc);
        return newDoc;
    }
};
