
'use client';

import { useState, useEffect } from 'react';
import { AuditLog } from '@/types';
import { AuditFilters } from '@/modules/audit/components/AuditFilters';
import { AuditTable } from '@/modules/audit/components/AuditTable';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { auditService } from '@/services/audit.service';

export type AuditLogFiltersState = {
    actorId?: string;
    action?: string;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
};

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [filters, setFilters] = useState<AuditLogFiltersState>({});
    const [isLoading, setIsLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchLogs(true);
    }, [filters]);

    const fetchLogs = async (isNewQuery: boolean = false) => {
        setIsLoading(true);

        try {
            const { logs: newLogs } = await auditService.getAuditLogs(filters, 20);
            
            if (isNewQuery) {
                setLogs(newLogs);
            } else {
                setLogs(prev => [...prev, ...newLogs]);
            }
            
            setHasMore(newLogs.length === 20);

        } catch (error) {
            console.error("Failed to fetch audit logs:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">Track all significant activities within the system.</p>
                </div>
            </div>
            
            <AuditFilters onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setLogs([]);
                setHasMore(true);
            }} />

            <AuditTable logs={logs} isLoading={isLoading && logs.length === 0} />

            {hasMore && !isLoading && (
                <div className="text-center">
                    <Button onClick={() => fetchLogs(false)} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...</> : 'Load More'}
                    </Button>
                </div>
            )}
        </div>
    );
}
