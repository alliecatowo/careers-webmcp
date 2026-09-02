import { apiClient } from '@/lib/apiClient';
import { AuditLog } from '@/types';

export const auditServerService = {
  getAuditLogs: async (
    filters: any,
    limit: number,
  ): Promise<{ logs: AuditLog[] }> => {
    const params = new URLSearchParams({ ...filters, limit: String(limit) });
    const response = await apiClient.get<{ logs: AuditLog[] }>(
      `/audit-logs?${params.toString()}`,
    );
    return response.data as { logs: AuditLog[] };
  },
  logEvent: (event: any) => {
    return apiClient.post('/audit-logs', event);
  },
};
