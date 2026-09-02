
import { ApplicationStatus, JobStatus } from '@/types';

// ===================================
// Internal, Normalized Data Models
// ===================================

/**
 * A simplified, standardized representation of a Job, containing only
 * the fields necessary for ATS integration.
 */
export interface InternalJob {
  id: string;
  title: string;
  description: string;
  country: string;
  department: string;
  employmentType: string;
  publishDate?: string;
  expiryDate?: string;
  status: JobStatus;
}

/**
 * A simplified, standardized representation of a candidate Application.
 */
export interface InternalApplication {
  id: string;
  jobId: string;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  resume: {
    fileName: string;
    fileContent: string; // Base64 encoded
  };
  status: ApplicationStatus;
  submittedAt: string;
}

// ===================================
// ATS Payload & Response Models
// ===================================

/**
 * A generic, provider-agnostic payload for creating/updating a job in an ATS.
 * This is the common format that the ATSSyncService works with.
 */
export interface ATSJobPayload {
  internalId: string;
  title: string;
  fullDescription: string;
  country: string;
  department: string;
  employmentType: string;
  status: 'open' | 'closed';
}

/**
 * A generic, provider-agnostic payload for creating an application in an ATS.
 */
export interface ATSApplicationPayload {
  internalId: string;
  internalJobId: string;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  resume: {
    fileName: string;
    fileContent: string;
  };
}

export type ATSSyncPayload = ATSJobPayload | ATSApplicationPayload;

/**
 * Standardized response format from an ATS provider's API call.
 */
export interface ATSResponse {
  success: boolean;
  externalId?: string; // The ID of the entity in the external ATS.
  error?: string; // Error message or code from the provider.
}

// ===================================
// Integration Event & Logging Models
// ===================================

/**
 * Represents a logged event related to an ATS integration action.
 */
export interface ATSIntegrationEvent {
  id: string;
  type: 'OUTBOUND_SYNC' | 'INBOUND_SYNC' | 'WEBHOOK_EVENT';
  provider: string;
  entityType: 'JOB' | 'APPLICATION';
  entityId: string; // The internal ID of the job or application.
  status: 'SUCCESS' | 'FAILED' | 'RETRYING';
  timestamp: string;
  error?: string;
  details?: Record<string, any>;
}
