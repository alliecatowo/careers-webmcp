import { Job, Application } from '@/lib/talent-acquisition';
import { ReportType, JobPerformanceData, ApplicationPipelineData, CountryHiringData, SlaComplianceData } from './types';
import { JobPerformanceReport } from './templates/JobPerformanceReport';
import { ApplicationPipelineReport } from './templates/ApplicationPipelineReport';
import { CountryHiringReport } from './templates/CountryHiringReport';
import { SlaComplianceReport } from './templates/SLAComplianceReport';

type ReportData = JobPerformanceData | ApplicationPipelineData | CountryHiringData | SlaComplianceData;

export class ReportBuilder {
    public async build(reportType: ReportType, jobs: Job[], applications: Application[]): Promise<ReportData[]> {
        console.log(`Building report of type: ${reportType}`);
        
        // Simulate async work, like fetching additional related data
        await new Promise(res => setTimeout(res, 200));

        switch (reportType) {
            case 'JOB_PERFORMANCE':
                return JobPerformanceReport.build(jobs);
            case 'APPLICATION_PIPELINE':
                return ApplicationPipelineReport.build(applications, jobs);
            case 'COUNTRY_HIRING':
                return CountryHiringReport.build(jobs, applications);
            case 'SLA_COMPLIANCE':
                return SlaComplianceReport.build(jobs);
            default:
                throw new Error(`Report type "${reportType}" is not supported.`);
        }
    }
}
