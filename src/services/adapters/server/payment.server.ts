
import { apiClient } from "@/lib/apiClient";

export const paymentServerService = {
    async getPayments() { 
        const res = await apiClient.get('/payments'); 
        if(!res.success) throw new Error(res.error || "Failed to fetch");
        return res.data;
    },
    async approvePayment(id: string) { 
        const res = await apiClient.post(`/payments/${id}/approve`, {}); 
        if(!res.success) throw new Error(res.error || "Failed to approve");
        return res.data;
    },
    async rejectPayment(id: string) { 
        const res = await apiClient.post(`/payments/${id}/reject`, {}); 
        if(!res.success) throw new Error(res.error || "Failed to reject");
        return res.data;
     },
};
