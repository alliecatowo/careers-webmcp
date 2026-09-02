
'use client';
import { useState } from 'react';
import { useRequest } from '@/lib/request/useRequest';
import { projectService } from '@/services/service';
import { Project } from '@/types/contracts';
import { DataTable, DataColumn } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ClientProjectsPage() {
    const { data: projectsResponse, isLoading, error } = useRequest(() => projectService.getAll());
    const [query, setQuery] = useState({ page: 1, limit: 10 });

    const columns: DataColumn<Project>[] = [
        { key: 'title', header: 'Title' },
        { key: 'budget', header: 'Budget' },
        { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
        { key: 'assignedContractorId', header: 'Contractor', render: (row) => row.assignedContractorId || 'N/A' },
        { key: 'deadline', header: 'Deadline', render: (row) => row.deadline ? new Date(row.deadline).toLocaleDateString() : 'N/A' },
        {
            key: 'actions', header: 'Actions', align: 'right', render: (row) => (
                <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/client/projects/${row.id}`}>Manage</Link>
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
                <p className="text-muted-foreground">An overview of all your projects.</p>
            </div>
            <DataTable 
                columns={columns}
                data={projectsResponse?.data?.data || []}
                isLoading={isLoading}
                error={error as any}
                query={query}
                setQuery={setQuery}
                totalCount={projectsResponse?.data?.total || 0}
                totalPages={projectsResponse?.data ? Math.ceil(projectsResponse.data.total / query.limit) : 0}
                onSelectionChange={() => {}}
                selectedRows={{}}
            />
        </div>
    );
}
