
import { apiClient } from "@/lib/apiClient";
import { ApplicationFormData, ApplicationStatus } from "@/types";

export const applicationServerService = {
    applyForJob: (data: ApplicationFormData) => apiClient.post("/applications", data),
    getApplicationsForUser: (userId: string) => apiClient.get(`/users/${userId}/applications`),
    getApplicationDetails: (id: string) => apiClient.get(`/applications/${id}`),
    updateApplicationStatus: (id: string, status: ApplicationStatus) => apiClient.put(`/applications/${id}/status`, { status }),
    scheduleInterview: (applicationId: string, dateTime: string) => apiClient.post(`/applications/${applicationId}/schedule-interview`, { dateTime }),
    sendOffer: (applicationId: string) => apiClient.post(`/applications/${applicationId}/send-offer`, {}),
    rejectApplication: (applicationId: string) => apiClient.post(`/applications/${applicationId}/reject`, {}),
};
