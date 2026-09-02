import { apiClient } from '@/lib/apiClient';
import { Document, DocumentType, DocumentStatus } from '@/types';

// This is a placeholder for the real API service.
export const documentServerService = {
  async getDocumentsForCandidate(candidateId: string): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(
      `/candidates/${candidateId}/documents`,
    );
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch documents');
    return response.data || [];
  },
  async getAllDocuments(): Promise<Document[]> {
    const response = await apiClient.get<Document[]>(`/documents`);
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch all documents');
    return response.data || [];
  },
  async requestDocumentDeletion(
    documentId: string,
  ): Promise<{ success: boolean }> {
    const response = await apiClient.post(
      `/documents/${documentId}/request-deletion`,
      {},
    );
    return { success: response.success };
  },
  async updateDocumentStatus(
    documentId: string,
    status: 'VERIFIED' | 'REJECTED',
  ): Promise<{ success: boolean }> {
    const response = await apiClient.put(`/documents/${documentId}/status`, {
      status,
    });
    return { success: response.success };
  },
  async approveDeletion(documentId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(
      `/documents/${documentId}/approve-deletion`,
      {},
    );
    return { success: response.success };
  },
  async uploadDocument(data: any): Promise<Document> {
    // File uploads are typically handled with multipart/form-data
    // This is a simplified representation.
    const response = await apiClient.post<Document>('/documents/upload', data);
    if (!response.success)
      throw new Error(response.error || 'Failed to upload document');
    return response.data as Document;
  },
};
