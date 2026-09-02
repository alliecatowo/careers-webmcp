
import { Offer, OfferData } from "@/modules/offers/domain/offer.entity";
import { mockApplications } from "./applications.mock";
import { mockCandidates } from "./candidates.mock";

export const mockOffers: Offer[] = [
    {
        id: 'offer-1',
        applicationId: 'app-2',
        baseSalary: 185000,
        equityValue: 50000,
        bonus: 20000,
        currency: 'USD',
        status: 'PENDING_APPROVAL',
        approvals: [
            { approverId: '2', approverName: 'Recruiter (Acme)', status: 'Approved', timestamp: new Date() },
            { approverId: '3', approverName: 'Hiring Manager (Stark)', status: 'Pending', timestamp: null },
        ]
    },
    {
        id: 'offer-2',
        applicationId: 'app-3',
        baseSalary: 120000,
        equityValue: 25000,
        bonus: 10000,
        currency: 'USD',
        status: 'ACCEPTED',
        approvals: [
            { approverId: '2', approverName: 'Recruiter (Acme)', status: 'Approved', timestamp: new Date() },
            { approverId: '3', approverName: 'Hiring Manager (Stark)', status: 'Approved', timestamp: new Date() },
        ]
    },
    {
        id: 'offer-3',
        applicationId: 'app-4',
        baseSalary: 95000,
        equityValue: 0,
        bonus: 5000,
        currency: 'EUR',
        status: 'REJECTED',
        approvals: [
            { approverId: '2', approverName: 'Recruiter (Acme)', status: 'Approved', timestamp: new Date() },
        ]
    }
];

export const mockOfferData: OfferData = {
    application: mockApplications.find(app => app.id === 'app-2')!,
    candidate: mockCandidates.find(c => c.id === 'candidate-2')! as any,
    offer: mockOffers[0],
};
