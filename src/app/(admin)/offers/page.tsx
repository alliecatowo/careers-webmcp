
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RouteGuard } from '@/components/system/RouteGuard';
import { useOffers } from '@/modules/offers/hooks/useOffers';
import { OffersTable } from '@/modules/offers/components/OffersTable';
import { useToast } from '@/components/system/Toast/useToast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Offer } from '@/modules/offers/domain/offer.entity';
import { offerService } from '@/services/offer.service';


export default function OffersPage() {
    const { offers, isLoading, mutate } = useOffers();
    const { showToast } = useToast();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);

    const openDeleteDialog = (offer: Offer) => {
        setDeletingOffer(offer);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingOffer) return;
        try {
            await offerService.delete(deletingOffer.id);
            showToast({ type: 'success', title: "Offer Deleted", description: `The offer for ${deletingOffer.candidateName} has been removed.` });
            mutate(); // Re-fetch data
        } catch (error) {
            showToast({ type: 'error', title: "Error", description: "Failed to delete the offer." });
        } finally {
            setIsDeleteDialogOpen(false);
            setDeletingOffer(null);
        }
    };

    return (
        <RouteGuard permission='offers.view'>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Offer Management</h1>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <OffersTable
                        offers={offers || []}
                        onDelete={openDeleteDialog}
                    />
                )}
            </div>
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the offer for <span className="font-bold">{deletingOffer?.candidateName}</span>. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </RouteGuard>
    );
}
