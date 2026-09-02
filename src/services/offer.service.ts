
import { OfferFormData } from '@/types';
import { adapter } from './adapter';

export const offerService = {
    getAll: () => adapter.getAllOffers(),
    delete: (id: string) => adapter.deleteOffer(id),
    getOfferForApplication: (applicationId: string) => adapter.getOfferForApplication(applicationId),
    createOffer: (offerData: Partial<OfferFormData> & { applicationId: string, userId: string }) => adapter.createOffer(offerData),
    updateOfferStatus: (offerId: string, status: string, approverId: string) => adapter.updateOfferStatus(offerId, status, approverId),
    getOffersForCandidate: (candidateId: string) => adapter.getOffersForCandidate(candidateId),
    updateCandidateResponse: (offerId: string, response: 'ACCEPTED' | 'REJECTED') => adapter.updateCandidateResponse(offerId, response),
};
