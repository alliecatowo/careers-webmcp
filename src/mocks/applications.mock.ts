import {
  Application,
  ApplicationDetails,
  Document,
  StageHistory,
} from '@/types';
import { mockCandidates } from './candidates.mock';
import { mockInterviews } from './interviews.mock';

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    candidateId: 'candidate-1',
    jobId: 'job-1',
    status: 'TECHNICAL_ROUND',
    createdAt: new Date('2023-10-01'),
  },
  {
    id: 'app-2',
    candidateId: 'candidate-2',
    jobId: 'job-1',
    status: 'OFFER',
    createdAt: new Date('2023-10-02'),
  },
  {
    id: 'app-3',
    candidateId: 'candidate-3',
    jobId: 'job-2',
    status: 'HIRED',
    createdAt: new Date('2023-09-15'),
  },
  {
    id: 'app-4',
    candidateId: 'candidate-4',
    jobId: 'job-3',
    status: 'REJECTED',
    createdAt: new Date('2023-09-20'),
  },
];

export const mockStageHistories: StageHistory[] = [
  {
    id: 'sh-1',
    applicationId: 'app-1',
    stage: 'APPLIED',
    timestamp: new Date('2023-10-01'),
  },
  {
    id: 'sh-2',
    applicationId: 'app-1',
    stage: 'SCREENED',
    timestamp: new Date('2023-10-03'),
  },
  {
    id: 'sh-3',
    applicationId: 'app-1',
    stage: 'TECHNICAL_ROUND',
    timestamp: new Date('2023-10-05'),
  },
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    candidateId: 'candidate-1',
    name: 'Resume_JaneDoe.pdf',
    type: 'RESUME',
    country: 'US',
    url: '#',
    uploadedAt: new Date('2023-10-01'),
    status: 'VERIFIED',
  },
  {
    id: 'doc-2',
    candidateId: 'candidate-1',
    name: 'Portfolio_JaneDoe.pdf',
    type: 'PORTFOLIO',
    country: 'US',
    url: '#',
    uploadedAt: new Date('2023-10-01'),
    status: 'VERIFIED',
  },
];

export const mockApplicationDetails: ApplicationDetails = {
  application: mockApplications[0],
  candidate: {
    ...mockCandidates.find((c) => c.id === mockApplications[0].candidateId)!,
    jobId: mockApplications[0].jobId,
    jobTitle: 'Senior Frontend Engineer',
    status: mockApplications[0].status,
    appliedAt: mockApplications[0].createdAt,
    country: 'US',
  },
  interviews: mockInterviews.filter(
    (i) => i.applicationId === mockApplications[0].id,
  ),
  stageHistory: mockStageHistories.filter(
    (sh) => sh.applicationId === mockApplications[0].id,
  ),
  documents: mockDocuments.filter(
    (d) => d.candidateId === mockApplications[0].candidateId,
  ),
};
