
import { adapter } from './adapter';
import { AuditLogFiltersState } from '@/app/(admin)/audit-logs/page';
import { AuditLog } from '@/types';

export const auditService = {
    getAuditLogs: (filters: AuditLogFiltersState, limit: number) => adapter.getAuditLogs(filters, limit),
    logEvent: (event: Omit<AuditLog, 'id' | 'timestamp'>) => (adapter as any).logEvent(event),
};
