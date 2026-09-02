
import { apiClient } from "@/lib/apiClient";
import { OfferFormData } from "@/types";

export const offerServerService = {
    getAll: () => apiClient.get('/offers'),
    delete: (id: string) => apiClient.delete(`/offers/${id}`),
    getOfferForApplication: (applicationId: string) => apiClient.get(`/applications/${applicationId}/offer`),
    createOffer: (data: Partial<OfferFormData> & { applicationId: string }) => apiClient.post('/offers', data),
    updateOfferStatus: (offerId: string, status: string, approverId: string) => apiClient.put(`/offers/${offerId}/status`, { status, approverId }),
};
