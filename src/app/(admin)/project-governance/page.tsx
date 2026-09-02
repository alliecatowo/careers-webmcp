
'use client';

import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { projectService } from '@/services/project.service';
import { Project, ProjectStatus } from '@/modules/projects/domain/project.entity';
import { adminProjectColumns } from '@/modules/projects/components/AdminProjectColumns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/components/system/Toast/useToast';
import { MobileProjectCard } from '@/modules/projects/components/MobileProjectCard';

export default function ProjectsPage() {
    const { showToast } = useToast();
    const {
        data,
        error,
        isLoading,
        query,
        setQuery,
        refresh,
    } = useDataTable<Project>({
        fetchData: projectService.getProjects,
    });

    const handleStatusChange = async (id: string, status: ProjectStatus) => {
        try {
            await projectService.updateProjectStatus(id, status);
            showToast({
                type: 'success',
                title: 'Status Updated',
                description: `Project status has been changed to ${status.replace('_', ' ')}.`,
            });
            refresh();
        } catch (err) {
             showToast({
                type: 'error',
                title: 'Update Failed',
                description: "Could not update the project status.",
            });
        }
    };
    
    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Project Governance</h1>
                    <p className="text-muted-foreground">Review, approve, and manage all projects on the platform.</p>
                </div>
                 <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                </Button>
            </div>

            {/* Mobile View */}
            <div className="grid gap-4 md:hidden">
                {(data?.data || []).map(proj => (
                    <MobileProjectCard key={proj.id} project={proj} onStatusChange={handleStatusChange} />
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <DataTable<Project>
                    columns={adminProjectColumns(handleStatusChange)}
                    data={data?.data || []}
                    isLoading={isLoading}
                    error={error as any}
                    query={query}
                    setQuery={setQuery}
                    totalCount={data?.total || 0}
                    totalPages={data?.totalPages || 1}
                    selectable={false}
                    selectedRows={{}}
                    onSelectionChange={() => {}}
                />
            </div>
        </div>
    );
}
