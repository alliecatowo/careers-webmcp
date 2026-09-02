import { JobStatus, EmploymentType } from '@/lib/talent-acquisition';

export const reportTypes = [
  "JOB_PERFORMANCE",
  "APPLICATION_PIPELINE",
  "COUNTRY_HIRING",
  "SLA_COMPLIANCE"
] as const;
export type ReportType = typeof reportTypes[number];

export const reportFormats = ["CSV", "XLSX", "PDF"] as const;
export type ReportFormat = typeof reportFormats[number];

export interface ReportFilters {
  country?: string[];
  department?: string[];
  status?: JobStatus[];
  employmentType?: EmploymentType[];
  dateRange?: { from: Date, to: Date };
  priority?: string[];
  hiringManager?: string[];
}

export interface ReportRequest {
  id: string;
  type: ReportType;
  filters: ReportFilters;
  format: ReportFormat;
  requestedBy: string; // User ID
  userRole: string; // To check permissions
  countryScope?: string;
  createdAt: Date;
}

export interface GeneratedReport {
  id: string;
  requestId: string;
  type: ReportType;
  format: ReportFormat;
  fileName: string;
  rowCount: number;
  generatedAt: Date;
  downloadUrl: string; // Mock URL
  requestedBy: string;
}

export interface ScheduledReport {
    id: string;
    reportType: ReportType;
    format: ReportFormat;
    filters: ReportFilters;
    cronExpression: string; // e.g., '0 0 * * *' for daily
    recipients: string[]; // email addresses
    lastRun?: Date;
    nextRun: Date;
    isActive: boolean;
}

export interface ReportLog {
    id: string;
    reportId: string;
    reportType: ReportType;
    generatedBy: string; // User ID or 'system'
    format: ReportFormat;
    rowCount: number;
    countryScope?: string;
    timestamp: Date;
}

// Data shapes for report templates
export interface JobPerformanceData {
    jobId: string;
    title: string;
    country: string;
    department: string;
    publishDate?: string;
    closeDate?: string;
    views: number;
    applicants: number;
    conversionRate: string;
    timeToFill?: number; // in days
}

export interface ApplicationPipelineData {
    applicationId: string;
    jobTitle: string;
    country: string;
    applicantName: string;
    status: string;
    submittedDate: string;
    daysInStage: number;
}

export interface CountryHiringData {
    country: string;
    totalJobs: number;
    activeJobs: number;
    closedJobs: number;
    totalApplications: number;
    avgTimeToFill: number; // in days
    conversionRate: string;
}

export interface SlaComplianceData {
    jobId: string;
    title: string;
    status: JobStatus;
    daysPending: number;
    slaThreshold: number; // in days
    isBreached: boolean;
    priority?: string;
}
