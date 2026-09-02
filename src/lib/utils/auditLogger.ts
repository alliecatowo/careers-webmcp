
type ClientAuditLogPayload = {
  actionType: string;
  performedBy: string; 
  targetId?: string;
  entityType?: 'candidate' | 'job' | 'user' | 'application' | 'offer' | 'system' | 'unknown';
  details?: Record<string, any>;
};

export function logAuditEvent(logData: ClientAuditLogPayload) {
  // MOCK: In a real app, this would send a log to your backend/Firestore.
}
