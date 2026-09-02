
import { apiClient } from "@/lib/apiClient";

export const organizationServerService = {
    async getUserOrganizations(userId: string) {
        const response = await apiClient.get(`/users/${userId}/organizations`);
        if (!response.success) throw new Error(response.error || "Failed to fetch organizations");
        return response.data || [];
    }
};
