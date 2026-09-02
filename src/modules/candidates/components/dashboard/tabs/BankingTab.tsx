
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CreditCard, Plus, ShieldCheck, MoreVertical, Bitcoin, VenetianMask } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type PaymentMethodType = 'STRIPE' | 'PAYPAL' | 'SWIFT' | 'BTC' | 'USDT';
type PaymentMethod = {
    id: string;
    type: PaymentMethodType;
    details: string;
    status: 'VERIFIED' | 'PENDING';
};

const mockPaymentMethods: PaymentMethod[] = [
    { id: 'pm-1', type: 'SWIFT', details: '... 1234', status: 'VERIFIED' },
    { id: 'pm-2', type: 'PAYPAL', details: 'user@example.com', status: 'VERIFIED' },
];

const mockPaymentHistory = [
    { id: 'pay-1', date: '2024-06-15', project: 'Global Talent Network', amount: '$2,500.00', status: 'PAID' },
    { id: 'pay-2', date: '2024-05-15', project: 'Global Talent Network', amount: '$2,500.00', status: 'PAID' },
];

const paymentMethodIcons: Record<PaymentMethodType, React.ReactNode> = {
    STRIPE: <CreditCard className="h-6 w-6" />,
    PAYPAL: <CreditCard className="h-6 w-6" />,
    SWIFT: <Banknote className="h-6 w-6" />,
    BTC: <Bitcoin className="h-6 w-6" />,
    USDT: <VenetianMask className="h-6 w-6" />,
}

function PaymentMethodForm() {
    // This would be a form with react-hook-form in a real implementation
    return (
        <div className="p-6">
            <p className="text-muted-foreground">Payment method linking is currently a mock feature. Clicking 'Link' will simulate adding a new payment method.</p>
            <Button className="mt-4">Link Account (Mock)</Button>
        </div>
    )
}

export function BankingTab() {
    const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your linked accounts for receiving payments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {paymentMethods.map(method => (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                             <div className="flex items-center gap-3">
                                {paymentMethodIcons[method.type]}
                                <div>
                                    <p className="font-semibold">{method.type}</p>
                                    <p className="text-sm text-muted-foreground">{method.details}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={method.status === 'VERIFIED' ? 'default' : 'outline'} className={method.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : ''}>
                                    {method.status}
                                </Badge>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment Method
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Link a New Payment Method</DialogTitle>
                            </DialogHeader>
                            <PaymentMethodForm />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A record of all payments received from Baalvion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <caption className="sr-only">A table of your payment history.</caption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPaymentHistory.map(payment => (
                                <TableRow key={payment.id}>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>{payment.project}</TableCell>
                                    <TableCell className="text-right">{payment.amount}</TableCell>
                                    <TableCell className="text-right"><Badge variant="default" className="bg-green-100 text-green-800">{payment.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
