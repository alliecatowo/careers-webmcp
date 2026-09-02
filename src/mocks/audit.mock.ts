
import { AuditLog } from "@/types";

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log-1',
        actorId: '2',
        actorName: 'Recruiter (Acme)',
        actionType: 'STATUS_UPDATE',
        entityType: 'candidate',
        entityId: 'candidate-1',
        timestamp: new Date('2023-10-05T10:00:00Z').toISOString(),
        details: { from: 'SCREENING', to: 'TECHNICAL_ROUND', jobId: 'job-1' },
        tenantId: 'org_acme'
    },
    {
        id: 'log-2',
        actorId: 'system',
        actorName: 'System',
        actionType: 'NOTE_ADDED',
        entityType: 'candidate',
        entityId: 'candidate-2',
        timestamp: new Date('2023-10-04T15:30:00Z').toISOString(),
        details: { note: 'Strong performance in initial screening call.' },
        tenantId: 'org_acme'
    },
    {
        id: 'log-3',
        actorId: '3',
        actorName: 'Hiring Manager (Stark)',
        actionType: 'JOB_UPDATED',
        entityType: 'job',
        entityId: 'job-2',
        timestamp: new Date('2023-10-04T11:00:00Z').toISOString(),
        details: { changedFields: ['description', 'status'] },
        tenantId: 'org_stark'
    },
     {
        id: 'log-4',
        actorId: 'candidate-4',
        actorName: 'Elena Rodriguez',
        actionType: 'APPLICATION_SUBMITTED',
        entityType: 'application',
        entityId: 'app-4',
        timestamp: new Date('2023-10-04T09:00:00Z').toISOString(),
        details: { jobId: 'job-3' },
        tenantId: 'org_stark'
    }
];
