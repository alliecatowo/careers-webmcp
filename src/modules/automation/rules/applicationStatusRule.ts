
import { Application } from '@/types';
import { Job } from '@/lib/talent-acquisition';
import { AutomationAuditLog } from '../types';

export function runApplicationStatusRule(updatedJobs: Job[], applications: Application[]): { updatedApplications: Application[], logs: AutomationAuditLog[] } {
  const updatedApplications: Application[] = [];
  const logs: AutomationAuditLog[] = [];
  const now = new Date();

  const closedJobIds = new Set(updatedJobs.filter(j => j.status === 'closed').map(j => j.id));

  if (closedJobIds.size === 0) {
    return { updatedApplications, logs };
  }

  applications.forEach(app => {
    // Per the prompt, if a job is closed, move applications from APPLIED -> SCREENED
    if (closedJobIds.has(app.jobId) && app.status === 'APPLIED') {
      const updatedApp = { ...app, status: 'SCREENED' as const };
      updatedApplications.push(updatedApp);

      logs.push({
        id: `log-app-status-${Date.now()}`,
        entityId: app.id,
        entityType: 'application',
        action: 'AUTO_STATUS_UPDATE_ON_JOB_CLOSE',
        previousValue: 'APPLIED',
        newValue: 'SCREENED',
        timestamp: now,
        triggeredBy: 'AutomationEngine',
      });
    }
  });

  return { updatedApplications, logs };
}
