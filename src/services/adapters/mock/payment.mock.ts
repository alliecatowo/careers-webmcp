import { Payment, PaymentStatus } from '@/types/payment.types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let mockPayments: Payment[] = [
    { id: 'pay-1', candidateId: 'cand-001', candidateName: 'Elena Rodriguez', amount: 2500.00, currency: 'EUR', method: 'SWIFT', status: 'PENDING_APPROVAL', date: '2024-07-01', tenantId: 'org_acme' },
    { id: 'pay-2', candidateId: 'cand-002', candidateName: 'John Smith', amount: 0.05, currency: 'BTC', method: 'BTC', status: 'APPROVED', date: '2024-06-28', tenantId: 'org_stark' },
    { id: 'pay-3', candidateId: 'cand-003', candidateName: 'Jane Doe', amount: 1800.00, currency: 'USD', method: 'PAYPAL', status: 'PAID', date: '2024-06-15', tenantId: 'org_acme' },
    { id: 'pay-4', candidateId: 'cand-004', candidateName: 'Test User', amount: 4200.00, currency: 'USD', method: 'STRIPE', status: 'PENDING_APPROVAL', date: '2024-07-03', tenantId: 'org_stark' },
];

export const paymentMockService = {
    async getPayments(): Promise<Payment[]> {
        await delay(400);
        const tenantId = localStorage.getItem('talent-os-tenant-id');
        if (!tenantId) return [];
        return mockPayments.filter(p => p.tenantId === tenantId);
    },
    async approvePayment(paymentId: string): Promise<Payment> {
        await delay(300);
        const payment = mockPayments.find(p => p.id === paymentId);
        if (!payment) throw new Error("Payment not found");
        if (payment.status !== 'PENDING_APPROVAL') throw new Error("Payment is not pending approval.");
        payment.status = 'APPROVED';
        return payment;
    },
    async rejectPayment(paymentId: string): Promise<Payment> {
        await delay(300);
        const payment = mockPayments.find(p => p.id === paymentId);
        if (!payment) throw new Error("Payment not found");
        if (payment.status !== 'PENDING_APPROVAL') throw new Error("Payment is not pending approval.");
        payment.status = 'REJECTED';
        return payment;
    }
};
