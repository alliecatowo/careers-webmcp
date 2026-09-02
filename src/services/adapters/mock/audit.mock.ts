
import { mockAuditLogs as initialLogs } from "@/mocks/audit.mock";
import { AuditLog } from "@/types";
import { AuditLogFiltersState } from "@/app/(admin)/audit-logs/page";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let mockAuditLogs: AuditLog[] = [...initialLogs];

export const auditMockService = {
    async getAuditLogs(filters: AuditLogFiltersState, limit: number) {
        await delay(500);
        const tenantId = localStorage.getItem('talent-os-tenant-id');
        if (!tenantId) return { logs: [] };
        
        // Mock tenant filtering
        const tenantLogs = mockAuditLogs.filter(log => log.tenantId === tenantId);

        // Further filter by passed filters (mock)
        return { logs: tenantLogs.slice(0, limit) };
    },

    async logEvent(event: Omit<AuditLog, 'id' | 'timestamp' | 'tenantId'>) {
        await delay(50);
        const tenantId = localStorage.getItem('talent-os-tenant-id') || 'org_acme';
        const newLog: AuditLog = {
            ...event,
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            tenantId,
        };
        mockAuditLogs.unshift(newLog);
        console.log('[Audit Mock] Event logged:', newLog);
    }
};
