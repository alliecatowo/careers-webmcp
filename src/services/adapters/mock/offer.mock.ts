import { mockOffers as allMockOffers, mockApplications } from '@/mocks';
import { mockCandidates } from '@/mocks/candidates.mock';
import { mockJobs } from '@/mocks/talent-platform/jobs.mock';
import {
  Offer,
  OfferData,
  OfferFormData,
  OfferStatus,
} from '@/modules/offers/domain/offer.entity';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const tenantOffers = allMockOffers.map((offer, i) => ({
  ...offer,
  status: (offer.applicationId === 'app-2'
    ? 'SENT'
    : offer.status) as OfferStatus, // Make one offer 'SENT' for the candidate to act on
  tenantId: i % 2 === 0 ? 'org_acme' : 'org_stark',
}));

let statefulOffers: (Offer & { tenantId: string })[] = [...tenantOffers];

export const offerMockService = {
  async getAll(): Promise<Offer[]> {
    await delay(400);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    const tenantData = tenantId
      ? statefulOffers.filter((o) => o.tenantId === tenantId)
      : [];

    return tenantData
      .map((offer) => {
        const app = mockApplications.find((a) => a.id === offer.applicationId);
        if (!app)
          return { ...offer, candidateName: 'Unknown', position: 'Unknown' };

        const candidate = mockCandidates.find((c) => c.id === app.candidateId);
        const job = mockJobs.find((j) => j.id === app.jobId);

        return {
          ...offer,
          candidateName: candidate?.name,
          position: job?.title,
          createdAt: app.createdAt.toISOString(),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
      );
  },

  async delete(id: string): Promise<void> {
    await delay(400);
    statefulOffers = statefulOffers.filter((o) => o.id !== id);
  },

  async getOfferForApplication(
    applicationId: string,
  ): Promise<OfferData | null> {
    await delay(400);
    const offer = statefulOffers.find((o) => o.applicationId === applicationId);
    const application = mockApplications.find((a) => a.id === applicationId);
    if (!application) return null;

    const candidate = mockCandidates.find(
      (c) => c.id === application.candidateId,
    );
    if (!candidate) return null;

    return {
      application,
      candidate: {
        ...candidate,
        jobId: application.jobId,
        status: application.status,
        appliedAt: application.createdAt,
        country: 'US', // Add default country
      },
      offer: offer || null,
    };
  },

  async createOffer(
    offerData: Partial<OfferFormData> & {
      applicationId: string;
      userId: string;
    },
  ): Promise<Offer> {
    await delay(600);
    const tenantId = localStorage.getItem('talent-os-tenant-id');
    if (!tenantId) throw new Error('No active tenant selected');

    const newOffer = {
      id: `offer-${Date.now()}`,
      status: 'PENDING_APPROVAL',
      approvals: [
        {
          approverId: offerData.userId,
          approverName: 'You',
          status: 'Approved',
          timestamp: new Date(),
        },
        {
          approverId: '3',
          approverName: 'Hiring Manager (Stark)',
          status: 'Pending',
          timestamp: null,
        },
      ],
      tenantId,
      ...offerData,
    } as Offer & { tenantId: string };

    statefulOffers.push(newOffer);
    return newOffer;
  },

  async updateOfferStatus(
    offerId: string,
    status: string,
    approverId: string,
  ): Promise<Offer> {
    await delay(400);
    const offerIndex = statefulOffers.findIndex((o) => o.id === offerId);
    if (offerIndex === -1) throw new Error('Offer not found');

    const { mockUsers } = await import('@/modules/users/services/user.mock');
    const offer = statefulOffers[offerIndex];
    const approver = mockUsers.find((u) => u.id === approverId);

    if (offer && approver) {
      const approval = offer.approvals.find(
        (ap) => ap.approverId === approverId,
      );
      if (approval) {
        approval.status = status as any;
        approval.timestamp = new Date();
      }
      if (offer.approvals.every((ap) => ap.status === 'Approved')) {
        offer.status = 'APPROVED';
      }
      statefulOffers[offerIndex] = offer;
      return offer;
    }
    throw new Error('Offer or approver not found');
  },

  async getOffersForCandidate(candidateId: string): Promise<Offer[]> {
    await delay(500);
    const { mockUsers } = await import('@/modules/users/services/user.mock');
    const user = mockUsers.find((u) => u.id === candidateId);
    if (!user) return [];

    const candidateApplications = mockApplications.filter(
      (app) => app.candidateId === candidateId,
    );
    const candidateAppIds = new Set(candidateApplications.map((app) => app.id));

    const candidateOffers = statefulOffers.filter(
      (offer) =>
        candidateAppIds.has(offer.applicationId) && offer.status !== 'DRAFT',
    );

    return candidateOffers.map((offer) => {
      const app = mockApplications.find((a) => a.id === offer.applicationId);
      if (!app) return { ...offer };

      const job = mockJobs.find((j) => j.id === app.jobId);

      return {
        ...offer,
        position: job?.title,
        createdAt: app.createdAt.toISOString(),
      };
    });
  },

  async updateCandidateResponse(
    offerId: string,
    response: 'ACCEPTED' | 'REJECTED',
  ): Promise<Offer> {
    await delay(500);
    const offerIndex = statefulOffers.findIndex((o) => o.id === offerId);
    if (offerIndex === -1) throw new Error('Offer not found');

    statefulOffers[offerIndex].status = response;
    return statefulOffers[offerIndex];
  },
};
