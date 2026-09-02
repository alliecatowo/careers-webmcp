'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { offerService } from '@/services/offer.service';
import { Offer } from '@/modules/offers/domain/offer.entity';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { OfferStatusBadge } from '@/modules/offers/components/OfferStatusBadge';
import { formatCurrency } from '@/lib/utils/currency';
import { Check, Download, FileText, X } from 'lucide-react';
import { useToast } from '@/components/system/Toast/useToast';

function OfferCard({ offer, onUpdate }: { offer: Offer; onUpdate: () => void }) {
    const { showToast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (status: 'ACCEPTED' | 'REJECTED') => {
        setIsUpdating(true);
        // Mock API call
        await offerService.updateCandidateResponse(offer.id, status);
        showToast({
            type: 'success',
            title: `Offer ${status.toLowerCase()}`,
            description: `You have ${status.toLowerCase()} the offer for ${offer.position}.`
        });
        onUpdate(); // Re-fetch offers
        setIsUpdating(false);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{offer.position}</CardTitle>
                        <CardDescription>Offer received on: {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}</CardDescription>
                    </div>
                    <OfferStatusBadge status={offer.status} />
                </div>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Base Salary</p>
                    <p className="text-lg font-semibold">{formatCurrency(offer.baseSalary, offer.currency)}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Signing Bonus</p>
                    <p className="text-lg font-semibold">{formatCurrency(offer.bonus, offer.currency)}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Equity Value</p>
                    <p className="text-lg font-semibold">{formatCurrency(offer.equityValue, offer.currency)}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                 <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download Offer PDF
                </Button>
                {offer.status === 'SENT' && (
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={() => handleUpdate('REJECTED')} disabled={isUpdating}>
                            <X className="mr-2 h-4 w-4" /> Decline
                        </Button>
                         <Button onClick={() => handleUpdate('ACCEPTED')} disabled={isUpdating}>
                            <Check className="mr-2 h-4 w-4" /> Accept
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

export function OffersList() {
    const { user } = useAuth();
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOffers = async () => {
        if (!user) return;
        setIsLoading(true);
        const data = await offerService.getOffersForCandidate(user.id);
        setOffers(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if(user) {
            fetchOffers();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    if (offers.length === 0) {
        return (
            <div className="text-center py-16 border border-dashed rounded-lg">
                 <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Offers Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">You have not received any job offers. Keep applying!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {offers.map(offer => (
                <OfferCard key={offer.id} offer={offer} onUpdate={fetchOffers} />
            ))}
        </div>
    )
}
