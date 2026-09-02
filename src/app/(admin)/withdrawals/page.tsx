
'use client';
import { useState } from 'react';
import { useRequest } from '@/lib/request/useRequest';
import { withdrawalService } from '@/services/service';
import { WithdrawalRequest } from '@/types/contracts';
import { DataTable, DataColumn } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/system/Toast/useToast';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/currency';

export default function AdminWithdrawalsPage() {
    const { showToast } = useToast();
    const { data: withdrawalsResponse, isLoading, error, execute: refresh } = useRequest(() => withdrawalService.getAll());
    
    // In a real app, these would call the service.
    const { run: approve, isLoading: isApproving } = useAsyncAction(async (id: string) => { /* await withdrawalService.approve(id) */ refresh(); }, { onSuccess: () => showToast({ type: 'success', title: 'Withdrawal Approved', description: 'No description provided' }) });
    const { run: reject, isLoading: isRejecting } = useAsyncAction(async (id: string) => { /* await withdrawalService.reject(id) */ refresh(); }, { onSuccess: () => showToast({ type: 'success', title: 'Withdrawal Rejected', description: 'No description provided' }) });

    const columns: DataColumn<WithdrawalRequest>[] = [
        { key: 'id', header: 'Request ID' },
        { key: 'userId', header: 'User ID' },
        { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, 'USD') },
        { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
        { key: 'createdAt', header: 'Requested At', render: (row) => new Date(row.createdAt).toLocaleString() },
        {
            key: 'actions', header: 'Actions', align: 'right', render: (row) => (
                <div className="flex gap-2 justify-end">
                    <Button size="sm" onClick={() => approve(row.id)} disabled={isApproving}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => reject(row.id)} disabled={isRejecting}>Reject</Button>
                </div>
            )
        }
    ];

    const [query, setQuery] = useState({ page: 1, limit: 10 });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Withdrawal Requests</h1>
                <p className="text-muted-foreground">Approve or reject contractor withdrawal requests.</p>
            </div>
            <DataTable
                columns={columns}
                data={withdrawalsResponse?.data?.data || []}
                isLoading={isLoading}
                error={error as any}
                query={query}
                setQuery={setQuery}
                totalCount={withdrawalsResponse?.data?.total || 0}
                totalPages={withdrawalsResponse?.data ? Math.ceil(withdrawalsResponse.data.total / query.limit) : 0}
                onSelectionChange={() => {}}
                selectedRows={{}}
            />
        </div>
    );
}
