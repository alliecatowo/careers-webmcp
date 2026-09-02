
'use client';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { useToast } from '@/components/system/Toast/useToast';
import { applicationService } from '@/services/application.service';
import { ApplicationWithCandidate } from '@/types';
import { WorkflowColumns } from '@/modules/campus/components/WorkflowColumns';

export default function WorkflowDashboardPage() {
    const { showToast } = useToast();
    const {
        data,
        error,
        isLoading,
        query,
        setQuery,
        refresh
    } = useDataTable<ApplicationWithCandidate>({
        fetchData: applicationService.getApplications,
    });

    const handleScheduleInterview = async (applicationId: string) => {
        // In a real app, this would open a dialog to select a date.
        await applicationService.scheduleInterview(applicationId, new Date().toISOString());
        showToast({ title: "Interview Scheduled", description: "The candidate has been notified (mock).", type: 'success' });
        refresh();
    };

    const handleSendOffer = async (applicationId: string) => {
        await applicationService.sendOffer(applicationId);
        showToast({ title: "Offer Sent", description: "The candidate has been notified (mock).", type: 'success' });
        refresh();
    };

    const handleReject = async (applicationId: string) => {
        await applicationService.rejectApplication(applicationId);
        showToast({ title: "Application Rejected", description: "The application has been marked as rejected.", type: 'success' });
        refresh();
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Campus Placement Workflow</h1>
                    <p className="text-muted-foreground">Manage the entire placement process from application to offer.</p>
                </div>
            </div>
            <DataTable<ApplicationWithCandidate>
                columns={WorkflowColumns({
                    onSchedule: handleScheduleInterview,
                    onOffer: handleSendOffer,
                    onReject: handleReject,
                })}
                data={data?.data || []}
                isLoading={isLoading}
                error={error}
                query={query}
                setQuery={setQuery}
                totalCount={data?.total || 0}
                totalPages={data?.totalPages || 1}
                selectable={false}
                selectedRows={{}}
                onSelectionChange={() => {}}
            />
        </div>
    );
}
