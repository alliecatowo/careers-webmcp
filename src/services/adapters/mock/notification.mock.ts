import { Notification } from "@/features/notifications";
import { socketEngine } from "@/lib/realtime/socket.engine";

let mockNotifications: Notification[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `notif-${i + 1}`,
    tenantId: i % 3 === 0 ? 'org_stark' : 'org_acme',
    title: i % 2 === 0 ? 'New Candidate Applied' : 'Interview Feedback Submitted',
    message: i % 2 === 0
        ? `John Doe applied for the Senior Engineer position.`
        : `Feedback was submitted for Jane Smith's technical interview.`,
    type: i % 2 === 0 ? 'INFO' : 'SUCCESS',
    read: i > 4, // First 5 are unread
    createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
    link: i % 2 === 0 ? '/candidates/1' : '/interviews/1'
}));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
let intervalId: NodeJS.Timeout | null = null;

export const notificationMockService = {
    async getNotifications(tenantId: string): Promise<Notification[]> {
        await delay(500);
        return mockNotifications.filter(n => n.tenantId === tenantId);
    },
    
    async getNotificationsForCandidate(candidateId: string): Promise<any[]> {
        await delay(300);
        // This is a placeholder for candidate-specific notifications which are not yet fully modeled.
        return [];
    },
    
    async markAsRead(id: string): Promise<void> {
        await delay(200);
        mockNotifications = mockNotifications.map(n => n.id === id ? { ...n, read: true } : n);
    },

    async markAllAsRead(tenantId: string): Promise<void> {
        await delay(300);
        mockNotifications = mockNotifications.map(n => n.tenantId === tenantId ? { ...n, read: true } : n);
    },

    sendNotification(userId: string, notification: Partial<Notification>) {
        const tenantId = localStorage.getItem('talent-os-tenant-id') || 'org_acme';
        const newNotif: Notification = {
            id: `notif-direct-${Date.now()}`,
            tenantId: tenantId, // This is a simplification
            read: false,
            createdAt: new Date().toISOString(),
            ...notification,
        } as Notification;
        
        mockNotifications.unshift(newNotif);
        console.log("Mock sending notification:", newNotif);
    },

    async sendEmail(email: string, subject: string, body: string): Promise<any> {
        await delay(100);
        console.log(`[MOCK EMAIL] To: ${email}, Subject: ${subject}, Body: ${body}`);
        return { success: true };
    },

    subscribeToNotifications(callback: (notification: Notification) => void): () => void {
        console.log("Subscribing to mock notifications...");
        socketEngine.connect();
        socketEngine.on('NEW_NOTIFICATION', callback);

        if (intervalId) clearInterval(intervalId); // Clear previous interval if any
        
        intervalId = setInterval(() => {
            const currentTenant = localStorage.getItem('talent-os-tenant-id') || 'org_acme';
            const newNotif: Notification = {
                id: `notif-realtime-${Date.now()}`,
                tenantId: currentTenant,
                title: "Offer Accepted!",
                message: "A candidate has accepted their offer for the Product Manager role.",
                type: 'SUCCESS',
                read: false,
                createdAt: new Date().toISOString(),
                link: '/offers'
            };
            socketEngine.emit('NEW_NOTIFICATION', newNotif);
        }, 30000); // Increased interval

        return () => {
            console.log("Unsubscribing from mock notifications.");
            if (intervalId) {
                clearInterval(intervalId);
            }
            // In a real app, you might not disconnect on every component unmount,
            // but for this mock setup it's fine.
            // socketEngine.disconnect(); 
        };
    }
};
