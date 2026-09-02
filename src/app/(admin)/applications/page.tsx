
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { applicationService } from '@/services/application.service';
import { ApplicationStatus, ApplicationWithCandidate } from '@/types';
import { applicationColumns } from '@/modules/applications/components/ApplicationColumns';
import { RouteGuard } from '@/components/system/RouteGuard';
import { Button } from '@/components/ui/button';
import { Download, Loader2, MessageSquare, ShieldX } from 'lucide-react';
import { MobileApplicationCard } from '@/modules/applications/components/MobileApplicationCard';
import { useToast } from '@/components/system/Toast/useToast';
import { notificationService } from '@/services/notification.service';

const ApplicationDetailDrawer = dynamic(
  () =>
    import('@/modules/applications/components/ApplicationDetailDrawer').then(
      (mod) => mod.ApplicationDetailDrawer
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    ),
  }
);

export default function ApplicationsPage() {
  const { showToast } = useToast();
  const {
    data,
    error,
    isLoading,
    query,
    setQuery,
    selectedRows,
    handleSelectionChange,
    clearSelection,
    refresh,
  } = useDataTable<ApplicationWithCandidate>({
    fetchData: applicationService.getApplications,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleViewDetails = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setIsDrawerOpen(true);
  };

  const handleBulkExport = () => {
    const selectedIds = Object.keys(selectedRows);

    if (selectedIds.length === 0) {
      showToast({
        type: 'info',
        title: 'No Selection',
        description: 'Please select applications to export.',
      });
      return; // Prevent further execution
    }

    const dataToExport = data?.data.filter((app) => selectedIds.includes(app.id));

    // Mock CSV generation and download
    const headers = ['ID', 'Candidate Name', 'Job Title', 'Status', 'Applied On'];
    const csvContent = [
      headers.join(','),
      ...(dataToExport || []).map((app) =>
        [
          app.id,
          `"${app.candidateName}"`,
          `"${app.jobTitle}"`,
          app.status,
          new Date(app.createdAt).toISOString(),
        ].join(',')
      ),
    ].join('\n');

    console.log('--- CSV EXPORT ---');
    console.log(csvContent);

    showToast({
      type: 'success',
      title: 'Export Started',
      description: `${selectedIds.length} applications are being exported. See console for CSV content.`,
    });
    clearSelection();
  };

  const handleBulkStatusChange = async (newStatus: ApplicationStatus) => {
    const selectedIds = Object.keys(selectedRows);
    if (selectedIds.length === 0) return;

    showToast({
      type: 'info',
      title: 'Bulk Update In Progress',
      description: `Updating ${selectedIds.length} applications to ${newStatus}...`,
    });

    try {
      await Promise.all(
        selectedIds.map((id) => applicationService.updateApplicationStatus(id, newStatus))
      );

      showToast({
        type: 'success',
        title: 'Bulk Update Successful',
        description: `${selectedIds.length} applications have been updated.`,
      });

      clearSelection();
      refresh();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Bulk Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <RouteGuard permission="candidates.view">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">Review and manage all candidate applications.</p>
          </div>
          <Button
            onClick={() =>
              showToast({
                type: 'info',
                title: 'Coming Soon!',
                description: 'Full data export is being implemented.',
              })
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>

        {/* Mobile View */}
        <div className="grid gap-4 md:hidden">
          {(data?.data || []).map((app) => (
            <MobileApplicationCard
              key={app.id}
              application={app}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <DataTable<ApplicationWithCandidate>
            columns={applicationColumns(handleViewDetails)}
            data={data?.data || []}
            isLoading={isLoading}
            error={error}
            query={query}
            setQuery={setQuery}
            totalCount={data?.total || 0}
            totalPages={data?.totalPages || 1}
            selectable={true}
            selectedRows={selectedRows}
            onSelectionChange={handleSelectionChange}
            bulkActions={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    showToast({
                      type: 'info',
                      title: 'Coming Soon!',
                      description: 'Bulk notifications are being implemented.',
                    })
                  }
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Notify ({Object.keys(selectedRows).length})
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkStatusChange('REJECTED')}
                >
                  <ShieldX className="mr-2 h-4 w-4" />
                  Reject ({Object.keys(selectedRows).length})
                </Button>
                <Button size="sm" onClick={handleBulkExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export ({Object.keys(selectedRows).length})
                </Button>
              </div>
            }
          />
        </div>
      </div>
      {isDrawerOpen && (
        <ApplicationDetailDrawer
          applicationId={selectedApplicationId}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </RouteGuard>
  );
}
