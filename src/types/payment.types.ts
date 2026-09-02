export type PaymentMethodType = 'STRIPE' | 'PAYPAL' | 'SWIFT' | 'BTC' | 'USDT';
export type PaymentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface Payment {
    id: string;
    candidateId: string;
    candidateName: string;
    amount: number;
    currency: string;
    method: PaymentMethodType;
    status: PaymentStatus;
    date: string;
    tenantId: string;
}
