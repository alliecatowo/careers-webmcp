
'use client';
import { useState } from 'react';
import { useRequest } from '@/lib/request/useRequest';
import { applicationService } from '@/services/service';
import { ProjectApplication } from '@/types/contracts';
import { DataTable, DataColumn } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ContractorApplicationsPage() {
    // MOCK: In a real app, this would fetch applications for the current user ID
    const { data: applicationsResponse, isLoading, error } = useRequest(() => applicationService.getAll());
    const [query, setQuery] = useState({ page: 1, limit: 10 });
    
    const columns: DataColumn<ProjectApplication>[] = [
        { key: 'projectId', header: 'Project' },
        { key: 'proposedBudget', header: 'Proposed Budget', render: (row) => row.proposedBudget ? `$${row.proposedBudget}` : 'N/A' },
        { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
        { key: 'createdAt', header: 'Date', render: (row) => new Date(row.createdAt).toLocaleDateString() },
        {
            key: 'actions', header: 'Actions', align: 'right', render: (row) => (
                <Button variant="destructive" size="sm" disabled>Withdraw</Button>
            )
        }
    ];
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
                <p className="text-muted-foreground">Track the status of your project applications.</p>
            </div>
             <DataTable 
                columns={columns}
                data={applicationsResponse?.data?.data || []}
                isLoading={isLoading}
                error={error as any}
                query={query}
                setQuery={setQuery}
                totalCount={applicationsResponse?.data?.total || 0}
                totalPages={applicationsResponse?.data ? Math.ceil(applicationsResponse.data.total / query.limit) : 0}
                onSelectionChange={() => {}}
                selectedRows={{}}
            />
        </div>
    );
}
