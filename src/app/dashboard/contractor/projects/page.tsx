
'use client';
import { useState } from 'react';
import { useRequest } from '@/lib/request/useRequest';
import { projectService } from '@/services/service';
import { Project } from '@/types/contracts';
import { DataTable, DataColumn } from '@/components/system/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ContractorProjectsPage() {
    const { data: projectsResponse, isLoading, error } = useRequest(() => projectService.getAll());
    const [query, setQuery] = useState({ page: 1, limit: 10 });
    
    // MOCK: In a real app, you would fetch projects where assignedContractorId matches current user
    const assignedProjects = projectsResponse?.data?.data.filter(p => p.assignedContractorId);

    const columns: DataColumn<Project>[] = [
        { key: 'title', header: 'Title' },
        { key: 'budget', header: 'Budget' },
        { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
        { key: 'clientId', header: 'Client' },
        { key: 'deadline', header: 'Deadline', render: (row) => row.deadline ? new Date(row.deadline).toLocaleDateString() : 'N/A' },
        {
            key: 'actions', header: 'Actions', align: 'right', render: (row) => (
                <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/contractor/projects/${row.id}`}>Manage</Link>
                </Button>
            )
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Active Projects</h1>
                <p className="text-muted-foreground">Projects you have been assigned to.</p>
            </div>
            <DataTable 
                columns={columns}
                data={assignedProjects || []}
                isLoading={isLoading}
                error={error as any}
                query={query}
                setQuery={setQuery}
                totalCount={assignedProjects?.length || 0}
                totalPages={assignedProjects ? Math.ceil(assignedProjects.length / query.limit) : 0}
                onSelectionChange={() => {}}
                selectedRows={{}}
            />
        </div>
    );
}
