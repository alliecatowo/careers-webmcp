
import { adapter } from './adapter';
import { Payment } from '@/types/payment.types';

interface PaymentServiceAdapter {
    getPayments(): Promise<Payment[]>;
    approvePayment(id: string): Promise<Payment>;
    rejectPayment(id: string): Promise<Payment>;
}


export const paymentService: PaymentServiceAdapter = adapter;
