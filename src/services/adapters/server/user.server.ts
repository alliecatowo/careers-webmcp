
import { apiClient } from "@/lib/apiClient";
import { SystemUser } from "@/features/users/domain/user.entity";

// This is a placeholder for the real API service.
// The methods are named to match the mock service for adapter compatibility.
export const userServerService = {
    async getUsers(): Promise<SystemUser[]> {
        const response = await apiClient.get<SystemUser[]>("/users");
        if (!response.success) throw new Error(response.error || "Failed to fetch users");
        return response.data || [];
    },
    
    async getUserById(id: string): Promise<SystemUser | undefined> {
        const response = await apiClient.get<SystemUser>(`/users/${id}`);
        if (!response.success) return undefined;
        return response.data || undefined;
    },

    async create(user: Omit<SystemUser, 'id' | 'createdAt'>): Promise<SystemUser> {
        const response = await apiClient.post<SystemUser>("/users", user);
        if (!response.success) throw new Error(response.error || "Failed to create user");
        return response.data!;
    },

    async update(id: string, user: Partial<SystemUser>): Promise<SystemUser> {
        const response = await apiClient.put<SystemUser>(`/users/${id}`, user);
        if (!response.success) throw new Error(response.error || "Failed to update user");
        return response.data!;
    },

    async deleteUser(id: string): Promise<void> {
        const response = await apiClient.delete(`/users/${id}`);
        if (!response.success) throw new Error(response.error || "Failed to delete user");
    },
};
