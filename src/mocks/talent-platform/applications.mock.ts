
import { Application, MultiPhaseApplicationData } from '@/types';
import { mockJobs } from './jobs.mock';
import { mockCandidates } from '@/mocks/candidates.mock';

export let applications: Application[] = [
    { id: 'app-1', candidateId: 'candidate-1', jobId: 'job-1', status: 'TECHNICAL_ROUND', createdAt: new Date('2023-10-01') },
    { id: 'app-2', candidateId: 'candidate-2', jobId: 'job-1', status: 'OFFER', createdAt: new Date('2023-10-02') },
    { id: 'app-3', candidateId: 'candidate-3', jobId: 'job-2', status: 'HIRED', createdAt: new Date('2023-09-15') },
    { id: 'app-4', candidateId: 'candidate-4', jobId: 'job-3', status: 'REJECTED', createdAt: new Date('2023-09-20') },
];

// New mock storage for detailed, multi-phase applications
let detailedApplications: MultiPhaseApplicationData[] = [];

export function getAllApplications(): Application[] {
    return applications;
}

export function getAllDetailedApplications(): MultiPhaseApplicationData[] {
    return detailedApplications.map(app => {
        const job = mockJobs.find(j => j.id === app.jobId);
        return {
            ...app,
            jobTitle: job?.title || 'Unknown Job'
        }
    });
}

export function getApplicationById(id: string): MultiPhaseApplicationData | undefined {
    const application = detailedApplications.find(app => app.id === id);
    if (!application) return undefined;

    const job = mockJobs.find(j => j.id === application.jobId);
    return {
        ...application,
        jobTitle: job?.title || 'Unknown Job'
    };
}

export function addApplication(applicationData: MultiPhaseApplicationData): MultiPhaseApplicationData {
    const newApp: MultiPhaseApplicationData = {
        ...applicationData,
        id: `app_mock_${Date.now()}`
    };
    detailedApplications.unshift(newApp);

    // Also create a summary record for the older application list
    const candidate = mockCandidates.find(c => c.email === newApp.email);
    const summaryApp: Application = {
        id: newApp.id!,
        candidateId: candidate?.id || `candidate-${Date.now()}`,
        jobId: newApp.jobId,
        status: 'APPLIED',
        createdAt: new Date(),
    };
    applications.unshift(summaryApp);
    return newApp;
}
