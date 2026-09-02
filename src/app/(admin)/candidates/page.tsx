
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { candidateService } from '@/services/candidate.service';
import { Candidate } from '@/modules/candidates/candidates.types';
import { candidateColumns } from '@/modules/candidates/components/CandidatesColumns';
import { RouteGuard } from '@/components/system/RouteGuard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/system/Toast/useToast';
import { AppError } from '@/lib/errors/error.types';

const CandidateFormDrawer = dynamic(() => import('@/modules/candidates/components/CandidateFormDrawer').then(mod => mod.CandidateFormDrawer), {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
});


export default function CandidatesPage() {
    const { showToast } = useToast();
    const {
        data,
        error,
        isLoading,
        query,
        setQuery,
        selectedRows,
        clearSelection,
        refresh,
    } = useDataTable<Candidate>({
        fetchData: candidateService.getCandidates,
    });
    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);

    const handleCreate = () => {
        setEditingCandidateId(null);
        setIsDrawerOpen(true);
    };
    
    const handleSaveSuccess = () => {
        setIsDrawerOpen(false);
        showToast({ type: 'success', title: 'Success', description: `Candidate has been successfully ${editingCandidateId ? 'updated' : 'created'}.` });
        refresh();
    }
    
    // Example of a bulk action handler
    const handleBulkStatusChange = async (newStatus: string) => {
        const selectedIds = Object.keys(selectedRows);
        showToast({
            type: 'info',
            title: "Bulk Update Started",
            description: `Updating status for ${selectedIds.length} candidates to ${newStatus}.`,
        });
        
        try {
            // In a real app, you might have a dedicated bulk update endpoint.
            // Here, we simulate it with parallel requests.
            await Promise.all(
                selectedIds.map(id => candidateService.updateStatus(id, newStatus as any))
            );

            showToast({
                type: 'success',
                title: 'Bulk Update Successful',
                description: `${selectedIds.length} candidates have been updated.`,
            });
            clearSelection();
            refresh(); // Refresh the table data
        } catch (err) {
            const appError = err as AppError;
            showToast({
                type: 'error',
                title: 'Bulk Update Failed',
                description: appError.message || "An unexpected error occurred.",
            });
        }
    };

    return (
        <RouteGuard permission='candidates.view'>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
                        <p className="text-muted-foreground">Manage all candidates in the pipeline.</p>
                    </div>
                    <Button onClick={handleCreate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Candidate
                    </Button>
                </div>
                
                <DataTable<Candidate>
                    columns={candidateColumns}
                    data={data?.data || []}
                    isLoading={isLoading}
                    error={error}
                    query={query}
                    setQuery={setQuery}
                    totalCount={data?.total || 0}
                    totalPages={data?.totalPages || 1}
                    selectable={true}
                    selectedRows={selectedRows}
                    onSelectionChange={({ action, rowId }) => {
                        if (action === 'toggle') {
                             // Logic for toggling a single row is handled by useDataTable
                        } else if (action === 'toggleAll') {
                             // Logic for toggling all rows is handled by useDataTable
                        }
                    }}
                    bulkActions={
                       <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBulkStatusChange('REJECTED')}
                        >
                            Bulk Reject ({Object.keys(selectedRows).length})
                        </Button>
                    }
                />
            </div>
            {isDrawerOpen && (
                <CandidateFormDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    candidateId={editingCandidateId}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </RouteGuard>
    );
}
