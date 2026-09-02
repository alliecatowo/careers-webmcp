import { ScheduledReport, ReportRequest } from './types';
import { ReportEngine } from './ReportEngine';

const mockScheduledReports: ScheduledReport[] = [
    {
        id: 'sched-1',
        reportType: 'COUNTRY_HIRING',
        format: 'PDF',
        cronExpression: '0 1 * * 1', // Every Monday at 1am
        filters: {},
        recipients: ['exec@baalvion.com'],
        lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        isActive: true,
    },
    {
        id: 'sched-2',
        reportType: 'SLA_COMPLIANCE',
        format: 'XLSX',
        cronExpression: '0 2 * * *', // Daily at 2am
        filters: {},
        recipients: ['compliance@baalvion.com', 'admin@baalvion.com'],
        lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
        isActive: true,
    }
];

export class ReportScheduler {
    private engine = new ReportEngine();

    async getScheduledReports(): Promise<ScheduledReport[]> {
        return [...mockScheduledReports];
    }

    async simulateDailyScheduleRun(): Promise<void> {
        console.log('Simulating daily scheduled report run...');
        const now = new Date();

        for (const report of mockScheduledReports) {
            if (report.isActive && report.nextRun <= now) {
                console.log(`Running scheduled report: ${report.reportType}`);
                const request: ReportRequest = {
                    id: `sched-req-${report.id}-${Date.now()}`,
                    type: report.reportType,
                    format: report.format,
                    filters: report.filters,
                    requestedBy: 'system-scheduler',
                    userRole: 'SUPER_ADMIN', // Scheduler runs with elevated privileges
                    createdAt: new Date(),
                };
                try {
                    const generated = await this.engine.generateReport(request);
                    console.log(`Scheduled report generated: ${generated.fileName}`);
                    // In real app, would email to recipients
                } catch(e) {
                    console.error(`Failed to run scheduled report ${report.id}`, e);
                }
            }
        }
    }
}
