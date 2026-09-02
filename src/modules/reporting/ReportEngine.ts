import { ReportRequest, GeneratedReport } from './types';
import { ReportBuilder } from './ReportBuilder';
import { ReportExporter } from './ReportExporter';
import { ReportLogger } from './ReportLogger';
import { ReportFilters } from './ReportFilters';
import { mockJobs, mockApplications } from './mockReportData';
import { canPerformAction } from '@/lib/access/permission.evaluator';
import { UserRole } from '@/lib/access/access.types';

export class ReportEngine {
    private builder = new ReportBuilder();
    private exporter = new ReportExporter();
    private logger = new ReportLogger();
    private filterer = new ReportFilters();

    async generateReport(request: ReportRequest): Promise<GeneratedReport> {
        // 1. RBAC Check
        const hasPermission = canPerformAction({
            userId: request.requestedBy,
            userRole: request.userRole as UserRole,
        }, 'analytics.view');

        if (!hasPermission) {
            throw new Error('You do not have permission to generate reports.');
        }

        console.log(`Generating report for ${request.requestedBy} with role ${request.userRole}`);

        // 2. Apply scoping and filters
        const { filteredJobs, filteredApplications } = this.filterer.apply(mockJobs, mockApplications, request.filters, request.countryScope);

        // 3. Build structured data
        const reportData = await this.builder.build(request.type, filteredJobs, filteredApplications);
        
        // Handle large dataset by chunking (mocked in exporter)
        if (reportData.length > 10000) {
            console.warn(`Large dataset detected: ${reportData.length} rows. Will be chunked.`);
        }

        // 4. Export to file format (mock)
        const exportResult = await this.exporter.export(reportData, request.format, request.type);

        // 5. Create the final report object
        const generatedReport: GeneratedReport = {
            id: `rep-${Date.now()}`,
            requestId: request.id,
            type: request.type,
            format: request.format,
            fileName: exportResult.fileName,
            rowCount: reportData.length,
            generatedAt: new Date(),
            downloadUrl: exportResult.downloadUrl,
            requestedBy: request.requestedBy
        };

        // 6. Log the event
        this.logger.log({
            reportId: generatedReport.id,
            reportType: generatedReport.type,
            generatedBy: request.requestedBy,
            format: request.format,
            rowCount: generatedReport.rowCount,
            countryScope: request.countryScope,
        });

        return generatedReport;
    }
}
