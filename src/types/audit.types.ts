
export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actionType: string;
  entityType: 'candidate' | 'job' | 'user' | 'application' | 'offer' | 'system' | 'unknown';
  entityId: string;
  timestamp: string;
  details?: any;
  tenantId: string;
}
