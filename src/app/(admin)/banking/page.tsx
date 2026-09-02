
'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard, MoreHorizontal, Bitcoin, VenetianMask, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/system/Toast/useToast";
import useSWR from "swr";
import { paymentService } from "@/services/payment.service";
import { Payment, PaymentMethodType, PaymentStatus } from "@/types/payment.types";
import { formatCurrency } from "@/lib/utils/currency";

const paymentMethodIcons: Record<PaymentMethodType, React.ReactNode> = {
    STRIPE: <CreditCard className="h-4 w-4" />,
    PAYPAL: <CreditCard className="h-4 w-4" />,
    SWIFT: <Banknote className="h-4 w-4" />,
    BTC: <Bitcoin className="h-4 w-4" />,
    USDT: <VenetianMask className="h-4 w-4" />,
}

const statusStyles: Record<PaymentStatus, string> = {
    PENDING_APPROVAL: "border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/50 dark:text-yellow-300",
    APPROVED: "border-transparent bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300",
    PAID: "border-transparent bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-300",
    REJECTED: "border-transparent bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

export default function BankingAdminPage() {
    const { showToast } = useToast();
    const { data: payments, error, isLoading, mutate } = useSWR('adminPayments', paymentService.getPayments);

    const handleApproval = async (paymentId: string, action: 'approve' | 'reject') => {
        try {
            if (action === 'approve') {
                await paymentService.approvePayment(paymentId);
            } else {
                await paymentService.rejectPayment(paymentId);
            }
            showToast({
                type: 'success',
                title: `Payment ${action}d`,
                description: `The payment has been successfully ${action}d.`
            });
            mutate(); // Re-fetch data
        } catch (err: any) {
            showToast({ type: 'error', title: 'Action Failed', description: err.message || 'Could not update payment status.'});
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )
        }
        if (error || !payments) {
            return <div className="text-center text-destructive">Failed to load payment data.</div>
        }

        return (
             <>
                {/* Mobile View */}
                <div className="grid gap-4 md:hidden">
                    {(payments || []).map((payment: Payment) => (
                         <Card key={payment.id}>
                            <CardHeader>
                                <CardTitle>{payment.candidateName}</CardTitle>
                                <CardDescription>{formatCurrency(payment.amount, payment.currency)} via {payment.method}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div><span className="font-semibold">Date:</span> {payment.date}</div>
                                <div><span className="font-semibold">Status:</span> <Badge className={statusStyles[payment.status]}>{payment.status.replace(/_/g, ' ')}</Badge></div>
                            </CardContent>
                             {payment.status === 'PENDING_APPROVAL' && (
                                <CardFooter className="flex gap-2 justify-end">
                                    <Button size="sm" variant="outline" onClick={() => handleApproval(payment.id, 'reject')} className="text-destructive border-destructive hover:bg-destructive/10"><X className="h-4 w-4 mr-2" />Reject</Button>
                                    <Button size="sm" onClick={() => handleApproval(payment.id, 'approve')}><Check className="h-4 w-4 mr-2" />Approve</Button>
                                </CardFooter>
                            )}
                         </Card>
                    ))}
                </div>
                 {/* Desktop View */}
                 <Card className="hidden md:block">
                    <CardHeader>
                        <CardTitle>Pending Payouts</CardTitle>
                        <CardDescription>Review and approve pending payments to candidates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <caption className="sr-only">A table of pending payment payouts for review.</caption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Candidate</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(payments || []).map((payment: Payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-medium">{payment.candidateName}</TableCell>
                                        <TableCell>{formatCurrency(payment.amount, payment.currency)}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            {paymentMethodIcons[payment.method as PaymentMethodType]}
                                            {payment.method}
                                        </TableCell>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>
                                            <Badge className={statusStyles[payment.status]}>{payment.status.replace(/_/g, ' ')}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {payment.status === 'PENDING_APPROVAL' && (
                                                <div className="flex gap-2 justify-end">
                                                    <Button size="sm" variant="outline" onClick={() => handleApproval(payment.id, 'reject')} className="text-destructive border-destructive hover:bg-destructive/10">Reject</Button>
                                                    <Button size="sm" onClick={() => handleApproval(payment.id, 'approve')}>Approve</Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                 </Card>
            </>
        );
    }
    
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Banking & Payments</h1>
                <p className="text-muted-foreground">Approve and manage candidate payment methods and payouts.</p>
            </div>
            {renderContent()}
        </div>
    );
}
