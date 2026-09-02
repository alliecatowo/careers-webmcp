
import { Document } from '@/types';

export const mockDocuments: Document[] = [
    { id: 'doc-1', candidateId: 'user-candidate', name: 'Resume_ElenaRodriguez.pdf', type: 'RESUME', country: 'US', url: '#', uploadedAt: new Date('2023-10-01'), status: 'VERIFIED' },
    { id: 'doc-2', candidateId: 'user-candidate', name: 'Portfolio_ElenaRodriguez.pdf', type: 'PORTFOLIO', country: 'US', url: '#', uploadedAt: new Date('2023-10-01'), status: 'VERIFIED' },
    { id: 'doc-3', candidateId: 'candidate-1', name: 'Resume_JaneDoe.pdf', type: 'RESUME', country: 'IN', url: '#', uploadedAt: new Date('2023-10-01'), status: 'PENDING_VERIFICATION' },
    { id: 'doc-4', candidateId: 'user-candidate', name: 'React_Advanced_Cert.pdf', type: 'TRAINING_CERTIFICATE', country: 'US', issueDate: '2022-05-15', url: '#', uploadedAt: new Date('2023-11-05'), status: 'VERIFIED' },
    { id: 'doc-5', candidateId: 'user-candidate', name: 'Employment_Letter_Old_Company.pdf', type: 'EMPLOYMENT_CERTIFICATE', country: 'CA', issueDate: '2021-08-20', url: '#', uploadedAt: new Date('2023-11-05'), status: 'PENDING_VERIFICATION' },
    { id: 'doc-6', candidateId: 'user-candidate', name: 'Salary_Slip_Jan.pdf', type: 'SALARY_CERTIFICATE', country: 'CA', issueDate: '2021-01-31', url: '#', uploadedAt: new Date('2023-11-10'), status: 'DELETION_REQUESTED' },
];
