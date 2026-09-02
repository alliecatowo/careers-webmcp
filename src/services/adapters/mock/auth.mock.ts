
import { mockUsers } from './user.mock';

const SESSION_KEY = 'auth_session';
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authMockService = {
    async login(email: string, password: string): Promise<{ success: boolean; userId?: string; message?: string; }> {
        await delay(500);
        const user = mockUsers.find(u => u.email === email); // Password check is ignored in mock
        if (user) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id }));
            return { success: true, userId: user.id };
        }
        return { success: false, message: "Invalid credentials" };
    },
    
    async logout(): Promise<void> {
        await delay(100);
        sessionStorage.removeItem(SESSION_KEY);
    },

    async checkSession(): Promise<{ isAuthenticated: boolean; userId: string | null; }> {
        await delay(300);
        const session = sessionStorage.getItem(SESSION_KEY);
        if (session) {
            try {
                const { userId } = JSON.parse(session);
                return { isAuthenticated: true, userId };
            } catch (e) {
                return { isAuthenticated: false, userId: null };
            }
        }
        return { isAuthenticated: false, userId: null };
    }
};
