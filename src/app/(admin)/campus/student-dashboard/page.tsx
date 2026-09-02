
'use client';
import { useDataTable } from '@/hooks/useDataTable';
import { DataTable } from '@/components/system/DataTable';
import { useToast } from '@/components/system/Toast/useToast';
import { applicationService } from '@/services/application.service';
import { notificationService } from '@/services/notification.service';
import { ApplicationStatus, ApplicationWithCandidate } from '@/types';
import { StudentApplicationColumns } from '@/modules/campus/student-dashboard/components/StudentApplicationColumns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function StudentDashboardPage() {
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

    const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
        try {
            await applicationService.updateApplicationStatus(applicationId, status);
            refresh();
            showToast({ title: "Status Updated", description: `Application status changed to ${status}.`, type: 'success' });
        } catch (e) {
            showToast({ title: 'Error Updating Status', description: 'No description provided', type: 'error' });
        }
    };

    const handleSendNotification = async (applicationId: string) => {
        const app = data?.data.find(a => a.id === applicationId);
        if (!app) return;
        
        await notificationService.sendNotification(app.candidateId, {
            title: `Update on your application for ${app.jobTitle}`,
            message: "Your application status has been updated. Please check your dashboard.",
            type: 'INFO',
            link: '/my-account/applications'
        });
        showToast({ title: 'Notification Sent', description: `In-app notification sent to ${app.candidateName}.`, type: 'success' });
    };

    const handleSendEmail = async (applicationId: string) => {
        const app = data?.data.find(a => a.id === applicationId);
        if (!app) return;

        await notificationService.sendEmail(
            app.candidateEmail,
            `Update on your application for ${app.jobTitle}`,
            `Hi ${app.candidateName},\n\nThis is a notification to let you know there has been an update regarding your application. Please log in to your dashboard to view the latest status.\n\nBest,\nThe Baalvion Team`
        );
        showToast({ title: 'Email Sent (Mock)', description: `An email has been sent to ${app.candidateName}.`, type: 'success' });
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Application Dashboard</h1>
                    <p className="text-muted-foreground">Monitor and manage all student applications.</p>
                </div>
            </div>
            <DataTable<ApplicationWithCandidate>
                columns={StudentApplicationColumns({ onStatusChange: handleStatusChange, onNotify: handleSendNotification, onEmail: handleSendEmail })}
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
