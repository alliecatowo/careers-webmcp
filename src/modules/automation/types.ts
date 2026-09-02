
import { Job } from '@/lib/talent-acquisition';
import { Application } from '@/types';

export interface AutomationNotification {
  id: string;
  type: 'STATUS_CHANGE' | 'SLA_BREACH' | 'JOB_EXPIRING_SOON' | 'AUTO_ACTION';
  recipientRole: 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
  message: string;
  entityId: string;
  entityType: 'job' | 'application';
  timestamp: Date;
}

export interface AutomationEscalation {
  id: string;
  jobId: string;
  escalatedTo: 'ADMIN' | 'SENIOR_MANAGEMENT';
  reason: string;
  timestamp: Date;
}

export interface AutomationAuditLog {
  id: string;
  entityId: string;
  entityType: 'job' | 'application';
  action: string;
  previousValue?: any;
  newValue?: any;
  timestamp: Date;
  triggeredBy: 'AutomationEngine';
}

export interface AutomationResult {
  updatedJobs: Job[];
  updatedApplications: Application[];
  notifications: AutomationNotification[];
  escalations: AutomationEscalation[];
  logs: AutomationAuditLog[];
}
