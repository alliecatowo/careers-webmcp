import { ApiAdapter } from '../api.adapter';
import { authServerService } from './auth.server';
import { userServerService } from './user.server';
import { candidateServerService } from './candidate.server';
import { applicationServerService } from './application.server';
import { interviewServerService } from './interview.server';
import { offerServerService } from './offer.server';
import { analyticsServerService } from './analytics.server';
import { auditServerService } from './audit.server';
import { notificationServerService } from './notification.server';
import { projectServerService } from './project.server';
import { organizationServerService } from './organization.server';
import { paymentServerService } from './payment.server';
import { teamServerService } from './team.server';
import { talentServerService } from './talent.server';
import { noteServerService } from './note.server';
import { documentServerService } from './document.server';
import { studentServerService } from './student.server';
import { campusServerService } from './campus.server';

// This adapter proxies calls to a real backend.
// Each method will eventually use the apiClient to make HTTP requests.
// Placeholders are added for methods not yet implemented on the server-side
// to ensure the adapter conforms to the ApiAdapter interface.
export const serverAdapter: ApiAdapter = {
  ...authServerService,
  ...userServerService,
  ...candidateServerService,
  ...applicationServerService,
  ...interviewServerService,
  ...offerServerService,
  ...analyticsServerService,
  ...auditServerService,
  ...notificationServerService,
  ...projectServerService,
  ...organizationServerService,
  ...paymentServerService,
  ...teamServerService,
  ...talentServerService,
  ...noteServerService,
  ...documentServerService,
  ...studentServerService,
  ...campusServerService,

  // Missing methods - add minimal implementations
  getCandidateById: (id: string) =>
    Promise.reject(new Error('Not implemented')),
  updateCandidateStatus: (id: string, stage: any) =>
    Promise.reject(new Error('Not implemented')),
  createCandidate: (candidateData: any) =>
    Promise.reject(new Error('Not implemented')),
  getCandidateProfile: (id: string) =>
    Promise.reject(new Error('Not implemented')),
  getLatestCandidates: (limit: number) =>
    Promise.reject(new Error('Not implemented')),
  getCandidates: (params: any) => Promise.reject(new Error('Not implemented')),
  getApplications: (query: any) => Promise.reject(new Error('Not implemented')),
  getApplicationsForUser: (userId: string) =>
    Promise.reject(new Error('Not implemented')),
  updateApplicationStatus: (id: string, status: any) =>
    Promise.reject(new Error('Not implemented')),
  sendOffer: (applicationId: string) =>
    Promise.reject(new Error('Not implemented')),
  rejectApplication: (applicationId: string) =>
    Promise.reject(new Error('Not implemented')),
  getAllInterviews: () => Promise.reject(new Error('Not implemented')),
  getInterviewsForCandidate: (candidateId: string) =>
    Promise.reject(new Error('Not implemented')),
  schedule: (data: any) => Promise.reject(new Error('Not implemented')),
  updateInterviewStatus: (id: string, status: any) =>
    Promise.reject(new Error('Not implemented')),
  submitInterviewFeedback: (id: string, feedback: string, rating: number) =>
    Promise.reject(new Error('Not implemented')),
  getAllOffers: () => Promise.reject(new Error('Not implemented')),
  deleteOffer: (id: string) => Promise.reject(new Error('Not implemented')),
  getOfferForApplication: (applicationId: string) =>
    Promise.reject(new Error('Not implemented')),
  createOffer: (offerData: any) => Promise.reject(new Error('Not implemented')),
  updateOfferStatus: (offerId: string, status: string, approverId: string) =>
    Promise.reject(new Error('Not implemented')),
  getOffersForCandidate: (candidateId: string) =>
    Promise.reject(new Error('Not implemented')),
  updateCandidateResponse: (offerId: string, response: any) =>
    Promise.reject(new Error('Not implemented')),
  getUserOrganizations: (userId: string) =>
    Promise.reject(new Error('Not implemented')),
  getPayments: () => Promise.reject(new Error('Not implemented')),
  approvePayment: (id: string) => Promise.reject(new Error('Not implemented')),
  rejectPayment: (id: string) => Promise.reject(new Error('Not implemented')),

  sendEmail: (email: string, subject: string, body: string) =>
    Promise.reject(new Error('Not implemented')),
  getJobs: (params: any) => Promise.reject(new Error('Not implemented')),
  create: (user: any) => Promise.reject(new Error('Not implemented')),
  update: (id: string, user: any) =>
    Promise.reject(new Error('Not implemented')),
  getColleges: (query) => Promise.reject(new Error('Not implemented')),
  getAllColleges: () => Promise.reject(new Error('Not implemented')),
  createCollege: (data) => Promise.reject(new Error('Not implemented')),
  updateCollege: (data) => Promise.reject(new Error('Not implemented')),
  deleteCollege: (collegeId) => Promise.reject(new Error('Not implemented')),
  getStudents: (query) => Promise.reject(new Error('Not implemented')),
  getAllStudents: () => Promise.reject(new Error('Not implemented')),
  createStudent: (data) => Promise.reject(new Error('Not implemented')),
  updateStudent: (data) => Promise.reject(new Error('Not implemented')),
  deleteStudent: (studentId) => Promise.reject(new Error('Not implemented')),
  getPendingPlacements: () => Promise.reject(new Error('Not implemented')),
  getApprovedPlacements: () => Promise.reject(new Error('Not implemented')),
  approvePlacement: (id, updates) =>
    Promise.reject(new Error('Not implemented')),
  getAIMatches: (query) => Promise.reject(new Error('Not implemented')),
  getRecentPlacements: (limit) => Promise.reject(new Error('Not implemented')),

  // Missing methods from ApiAdapter interface
  getDashboardData: (filters: any) =>
    Promise.reject(new Error('Not implemented')),
  getNotificationsForCandidate: (candidateId: string) =>
    Promise.reject(new Error('Not implemented')),
  sendNotification: (userId: string, notification: any) =>
    Promise.reject(new Error('Not implemented')),
  getTalentCountries: (filters: any) =>
    Promise.reject(new Error('Not implemented')),
  getTalentCountryBySlug: (slug: string) =>
    Promise.reject(new Error('Not implemented')),
  getTalentCountryById: (id: string) =>
    Promise.reject(new Error('Not implemented')),
  getTalentDepartments: (filters: any) =>
    Promise.reject(new Error('Not implemented')),
  getTalentJobs: (filters: any) => Promise.reject(new Error('Not implemented')),
  getTalentJobById: (id: string) =>
    Promise.reject(new Error('Not implemented')),
  getTalentComplianceProfile: (id: string) =>
    Promise.reject(new Error('Not implemented')),
  getTalentRolesByCountry: (slug: string) =>
    Promise.reject(new Error('Not implemented')),
  scheduleInterview: (applicationId: string, dateTime: string) =>
    Promise.reject(new Error('Not implemented')),
  getApplicationDetails: (id: string) =>
    Promise.reject(new Error('Not implemented')),
  addNote: (noteData: any) => Promise.reject(new Error('Not implemented')),
  requestDocumentDeletion: (documentId: string) =>
    Promise.reject(new Error('Not implemented')),
  updateDocumentStatus: (documentId: string, status: any) =>
    Promise.reject(new Error('Not implemented')),
  approveDeletion: (documentId: string) =>
    Promise.reject(new Error('Not implemented')),
  uploadDocument: (data: any) => Promise.reject(new Error('Not implemented')),
  // createTeamMember: (data: any) => Promise.reject(new Error('Not implemented')),
  // updateTeamMember: (id: string, data: any) =>
    // Promise.reject(new Error('Not implemented')),
  // deleteTeamMember: (id: string) =>
    // Promise.reject(new Error('Not implemented')),
  deleteUser: (id: string) => Promise.reject(new Error('Not implemented')),
  logEvent: (event: any) => Promise.reject(new Error('Not implemented')),
  markAsRead: (id: string) => Promise.reject(new Error('Not implemented')),
  markAllAsRead: (tenantId: string) =>
    Promise.reject(new Error('Not implemented')),
  subscribeToNotifications: (callback: any) => () => {},
};
