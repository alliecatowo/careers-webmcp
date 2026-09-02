import { ApiAdapter } from '../api.adapter';
import { authMockService } from './auth.mock';
import { userMockService } from './user.mock';
import { candidateMockService } from './candidate.mock';
import { applicationMockService } from './application.mock';
import { interviewsMockService } from './interview.mock';
import { offerMockService } from './offer.mock';
import { auditMockService } from './audit.mock';
import { notificationMockService } from './notification.mock';
import { organizationMockService } from './organization.mock';
import { noteMockService } from './note.mock';
import { documentMockService } from './document.mock';
import { paymentMockService } from './payment.mock';
import { analyticsMockService } from '@/modules/analytics/services/analytics.mock';
import { projectMockService } from '@/modules/projects/services/project.mock';
// import { teamMockService } from './team.mock';
import { talentMockService } from './talent.mock';
import { PaginatedResponse, TableQuery } from '@/components/system/DataTable';
import { Job as TalentJob } from '@/lib/talent-acquisition';
import { AdminJobsQueryParams } from '@/modules/jobs/jobs.hooks';
import { collegeMockService } from './college.mock';
import { studentMockService } from '@/modules/students/services/student.mock';
import { campusMockService } from './campus.mock';
import { placementMockService } from './placement.mock';

export const mockAdapter: ApiAdapter = {
  // Auth
  login: authMockService.login,
  logout: authMockService.logout,
  checkSession: authMockService.checkSession,

  // User
  getUsers: userMockService.getUsers,
  getUserById: userMockService.getUserById,
  create: userMockService.create,
  update: userMockService.update,
  deleteUser: userMockService.delete,

  // Job (This is a temporary bridge)
  getJobs: (
    params: AdminJobsQueryParams,
  ): Promise<PaginatedResponse<TalentJob>> => {
    return talentMockService.getJobs(params) as unknown as Promise<
      PaginatedResponse<TalentJob>
    >;
  },

  // Candidate
  getCandidates: candidateMockService.getCandidates,
  getCandidateById: candidateMockService.getById,
  getLatestCandidates: candidateMockService.getLatestCandidates,
  updateCandidateStatus: candidateMockService.updateStatus,
  createCandidate: candidateMockService.create,
  getCandidateProfile: candidateMockService.getCandidateProfile,

  // Application
  getApplications: applicationMockService.getApplications,
  getApplicationsForUser: applicationMockService.getApplicationsForUser,
  getApplicationDetails: applicationMockService.getApplicationDetails,
  updateApplicationStatus: applicationMockService.updateApplicationStatus,
  scheduleInterview: applicationMockService.scheduleInterview,
  sendOffer: applicationMockService.sendOffer,
  rejectApplication: applicationMockService.rejectApplication,

  // Interview
  getAllInterviews: interviewsMockService.getAllInterviews,
  getInterviewsForCandidate: interviewsMockService.getInterviewsForCandidate,
  schedule: interviewsMockService.schedule,
  updateInterviewStatus: interviewsMockService.updateStatus,
  submitInterviewFeedback: interviewsMockService.submitFeedback,

  // Offer
  getAllOffers: offerMockService.getAll,
  deleteOffer: offerMockService.delete,
  getOfferForApplication: offerMockService.getOfferForApplication,
  createOffer: offerMockService.createOffer,
  updateOfferStatus: offerMockService.updateOfferStatus,
  getOffersForCandidate: offerMockService.getOffersForCandidate,
  updateCandidateResponse: offerMockService.updateCandidateResponse,

  // Analytics
  getDashboardData: analyticsMockService.getDashboardData,

  // Audit
  getAuditLogs: auditMockService.getAuditLogs,
  logEvent: auditMockService.logEvent,

  // Notification
  getNotifications: notificationMockService.getNotifications,
  getNotificationsForCandidate:
    notificationMockService.getNotificationsForCandidate,
  markAsRead: notificationMockService.markAsRead,
  markAllAsRead: notificationMockService.markAllAsRead,
  subscribeToNotifications: notificationMockService.subscribeToNotifications,
  sendNotification: notificationMockService.sendNotification,
  sendEmail: notificationMockService.sendEmail,

  // Project
  getProjects: projectMockService.getProjects,
  getProjectById: projectMockService.getProjectById,
  updateProjectStatus: projectMockService.updateProjectStatus,

  // Organization
  getUserOrganizations: organizationMockService.getUserOrganizations,

  // Note
  getNotesForCandidate: noteMockService.getNotesForCandidate,
  addNote: noteMockService.addNote,

  // Document
  getDocumentsForCandidate: documentMockService.getDocumentsForCandidate,
  getAllDocuments: documentMockService.getAllDocuments,
  requestDocumentDeletion: documentMockService.requestDocumentDeletion,
  updateDocumentStatus: documentMockService.updateDocumentStatus,
  approveDeletion: documentMockService.approveDeletion,
  uploadDocument: documentMockService.uploadDocument,

  // Payment
  getPayments: paymentMockService.getPayments,
  approvePayment: paymentMockService.approvePayment,
  rejectPayment: paymentMockService.rejectPayment,

  // // Team
  // getTeamMembers: teamMockService.getTeamMembers,
  // getTeamMemberById: teamMockService.getTeamMemberById,
  // createTeamMember: teamMockService.createTeamMember,
  // updateTeamMember: teamMockService.updateTeamMember,
  // deleteTeamMember: teamMockService.deleteTeamMember,

  // Talent (Public)
  getTalentCountries: talentMockService.getCountries,
  getTalentCountryBySlug: talentMockService.getCountryBySlug,
  getTalentCountryById: talentMockService.getCountryById,
  getTalentDepartments: talentMockService.getDepartments,
  getTalentJobs: talentMockService.getJobs,
  getTalentJobById: talentMockService.getJobById,
  getTalentComplianceProfile: talentMockService.getComplianceProfile,
  getTalentRolesByCountry: talentMockService.getRolesByCountry,

  // College
  getColleges: collegeMockService.getColleges,
  getAllColleges: collegeMockService.getAllColleges,
  createCollege: collegeMockService.createCollege,
  updateCollege: collegeMockService.updateCollege,
  deleteCollege: collegeMockService.deleteCollege,

  // Student
  getStudents: studentMockService.getStudents,
  getAllStudents: studentMockService.getAllStudents,
  createStudent: studentMockService.createStudent,
  updateStudent: studentMockService.updateStudent,
  deleteStudent: studentMockService.deleteStudent,

  // Placement
  getPendingPlacements: placementMockService.getPendingPlacements,
  getApprovedPlacements: placementMockService.getApprovedPlacements,
  approvePlacement: placementMockService.approvePlacement,

  // Campus
  getAIMatches: campusMockService.getAIMatches,
  getRecentPlacements: campusMockService.getRecentPlacements,
};
