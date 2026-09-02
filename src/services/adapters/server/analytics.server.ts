
import { apiClient } from "@/lib/apiClient";

// These endpoints are examples and would need to be implemented in the backend.
export const analyticsServerService = {
    fetchDashboardStats: () => apiClient.get("/analytics/stats"),
    fetchPipelineData: () => apiClient.get("/analytics/pipeline"),
    fetchApplicationsOverTime: () => apiClient.get("/analytics/applications-over-time"),
    fetchOfferStatusData: () => apiClient.get("/analytics/offer-status"),
    fetchTimeInStageData: () => apiClient.get("/analytics/time-in-stage"),
    fetchCountryDensityData: () => apiClient.get("/analytics/country-density"),
};
