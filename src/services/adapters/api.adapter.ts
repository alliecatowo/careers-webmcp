import { TableQuery, PaginatedResponse } from '@/components/system/DataTable';
import {
  AnalyticsData,
  AnalyticsFilters,
} from '@/modules/analytics/domain/analytics.entity';
import {
  Candidate,
  CandidateStage,
  PaginatedCandidatesResponse,
} from '@/modules/candidates/candidates.types';
import {
  Interview,
  InterviewStatus,
} from '@/modules/interviews/domain/interview.entity';
import { JobFormData } from '@/lib/talent-acquisition/types/job';
import { AdminJobsQueryParams } from '@/modules/jobs/jobs.hooks';
import {
  Offer,
  OfferData,
  OfferFormData,
  OfferStatus,
} from '@/modules/offers/domain/offer.entity';
import {
  Project,
  ProjectStatus,
} from '@/modules/projects/domain/project.entity';
import { ProjectFilters } from '@/modules/projects/services/project.service';
import { SystemUser } from '@/modules/users/domain/user.entity';
import {
  Application,
  ApplicationDetails,
  ApplicationStatus,
  ApplicationWithCandidate,
  AuditLog,
  CandidateProfileData,
  Document,
  DocumentType,
  Note,
  Offer as CandidateOffer,
  Payment,
  PaymentStatus as CandidatePaymentStatus,
} from '@/types';
import { AuthUser } from '@/modules/auth/domain/user.types';
import { Organization } from '@/features/organization';
import { Notification } from '@/features/notifications';
// import { TeamMember } from '@/lib/team.data';
import {
  Job as TalentJob,
  Country,
  Department,
  ComplianceProfile,
} from '@/lib/talent-acquisition';
import { AuditLogFiltersState } from '@/app/(admin)/audit-logs/page';
import { College } from '@/mocks/colleges.mock';
import { Student } from '@/modules/students/domain/student.entity';
import { ApplicationMatch } from '@/modules/campus/types/campus.types';
import { Placement } from '@/types/placement.types';

export interface ApiAdapter {
  // Auth
  login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; userId?: string; message?: string }>;
  logout(): Promise<void>;
  checkSession(): Promise<{ isAuthenticated: boolean; userId: string | null }>;

  // User
  getUsers(): Promise<SystemUser[]>;
  getUserById(id: string): Promise<SystemUser | undefined>;
  create(user: Omit<SystemUser, 'id' | 'createdAt'>): Promise<SystemUser>;
  update(id: string, user: Partial<SystemUser>): Promise<SystemUser>;
  deleteUser(id: string): Promise<void>;

  // Job (This might be deprecated in favor of Talent Service)
  getJobs(params: AdminJobsQueryParams): Promise<PaginatedResponse<TalentJob>>;

  // Candidate
  getCandidates(params: TableQuery): Promise<PaginatedCandidatesResponse>;
  getCandidateById(id: string): Promise<Candidate | undefined>;
  getLatestCandidates(limit: number): Promise<Candidate[]>;
  updateCandidateStatus(id: string, stage: CandidateStage): Promise<Candidate>;
  createCandidate(candidateData: any): Promise<Candidate>;
  getCandidateProfile(id: string): Promise<CandidateProfileData | null>;

  // Application
  getApplications(
    query: TableQuery,
  ): Promise<PaginatedResponse<ApplicationWithCandidate>>;
  getApplicationsForUser(userId: string): Promise<Application[]>;
  getApplicationDetails(id: string): Promise<ApplicationDetails | null>;
  updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
  ): Promise<Application>;
  scheduleInterview(
    applicationId: string,
    dateTime: string,
  ): Promise<Application>;
  sendOffer(applicationId: string): Promise<Application>;
  rejectApplication(applicationId: string): Promise<Application>;

  // Interview
  getAllInterviews(): Promise<Interview[]>;
  getInterviewsForCandidate(candidateId: string): Promise<Interview[]>;
  schedule(data: any): Promise<Interview>;
  updateInterviewStatus(id: string, status: InterviewStatus): Promise<void>;
  submitInterviewFeedback(
    id: string,
    feedback: string,
    rating: number,
  ): Promise<void>;

  // Offer
  getAllOffers(): Promise<CandidateOffer[]>;
  deleteOffer(id: string): Promise<void>;
  getOfferForApplication(applicationId: string): Promise<OfferData | null>;
  createOffer(
    offerData: Partial<OfferFormData> & {
      applicationId: string;
      userId: string;
    },
  ): Promise<Offer>;
  updateOfferStatus(
    offerId: string,
    status: string,
    approverId: string,
  ): Promise<Offer>;
  getOffersForCandidate(candidateId: string): Promise<CandidateOffer[]>;
  updateCandidateResponse(
    offerId: string,
    response: 'ACCEPTED' | 'REJECTED',
  ): Promise<Offer>;

  // Analytics
  getDashboardData(filters: AnalyticsFilters): Promise<AnalyticsData>;

  // Audit
  getAuditLogs(
    filters: AuditLogFiltersState,
    limit: number,
  ): Promise<{ logs: AuditLog[] }>;
  logEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void>;

  // Notification
  getNotifications(tenantId: string): Promise<Notification[]>;
  getNotificationsForCandidate(candidateId: string): Promise<any[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(tenantId: string): Promise<void>;
  subscribeToNotifications(
    callback: (notification: Notification) => void,
  ): () => void;
  sendNotification(userId: string, notification: Partial<Notification>): void;
  sendEmail(studentId: string, subject: string, body: string): Promise<any>;

  // Project
  getProjects(query: TableQuery): Promise<PaginatedResponse<Project>>;
  getProjectById(id: string): Promise<Project | undefined>;
  updateProjectStatus(id: string, status: ProjectStatus): Promise<Project>;

  // Organization
  getUserOrganizations(userId: string): Promise<Organization[]>;

  // Note
  getNotesForCandidate(candidateId: string): Promise<Note[]>;
  addNote(noteData: Partial<Note>): Promise<Note>;

  // Document
  getDocumentsForCandidate(candidateId: string): Promise<Document[]>;
  getAllDocuments(): Promise<Document[]>;
  requestDocumentDeletion(documentId: string): Promise<{ success: boolean }>;
  updateDocumentStatus(
    documentId: string,
    status: 'VERIFIED' | 'REJECTED',
  ): Promise<{ success: boolean }>;
  approveDeletion(documentId: string): Promise<{ success: boolean }>;
  uploadDocument(data: {
    candidateId: string;
    file: File;
    documentType: DocumentType;
    country: string;
    issueDate?: string;
  }): Promise<Document>;

  // Payment
  getPayments(): Promise<Payment[]>;
  approvePayment(id: string): Promise<Payment>;
  rejectPayment(id: string): Promise<Payment>;

  // Team
  // getTeamMembers(): Promise<TeamMember[]>;
  // getTeamMemberById(id: string): Promise<TeamMember | undefined>;
  // createTeamMember(data: Omit<TeamMember, 'id'>): Promise<TeamMember>;
  // updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember>;
  // deleteTeamMember(id: string): Promise<{ success: boolean }>;

  // Talent (Public)
  getTalentCountries(filters: { isActive?: boolean }): Promise<Country[]>;
  getTalentCountryBySlug(slug: string): Promise<Country | undefined>;
  getTalentCountryById(id: string): Promise<Country | undefined>;
  getTalentDepartments(filters: {
    isActive?: boolean;
    countryId?: string;
  }): Promise<Department[]>;
  getTalentJobs(filters: any): Promise<PaginatedResponse<TalentJob>>;
  getTalentJobById(id: string): Promise<TalentJob | undefined>;
  getTalentComplianceProfile(
    id: string,
  ): Promise<ComplianceProfile | undefined>;
  getTalentRolesByCountry(slug: string): Promise<any[]>;

  // College
  getColleges(
    query: TableQuery,
  ): Promise<PaginatedResponse<College & { id: string }>>;
  getAllColleges(): Promise<
    (College & { id: string; type: '1' | '2' | '3' })[]
  >;
  createCollege(data: Omit<College, 'collegeId'>): Promise<College>;
  updateCollege(data: College): Promise<College>;
  deleteCollege(collegeId: string): Promise<{ success: boolean }>;

  // Student
  getStudents(query: TableQuery): Promise<PaginatedResponse<Student>>;
  getAllStudents(): Promise<(Student & { id: string })[]>;
  createStudent(data: Omit<Student, 'studentId'>): Promise<Student>;
  updateStudent(data: Student): Promise<Student>;
  deleteStudent(studentId: string): Promise<{ success: boolean }>;

  // Placement
  getPendingPlacements(): Promise<Placement[]>;
  getApprovedPlacements(): Promise<Placement[]>;
  approvePlacement(
    id: string,
    updates: { auditLogs: any[] },
  ): Promise<Placement>;

  // Campus
  getAIMatches(query: TableQuery): Promise<PaginatedResponse<ApplicationMatch>>;
  getRecentPlacements(limit: number): Promise<Student[]>;
}
