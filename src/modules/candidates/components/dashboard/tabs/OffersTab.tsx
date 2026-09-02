
'use client';

import { User } from "@/types";
import { OffersList } from "../offers-list";

interface OffersTabProps {
    user: User;
}

export function OffersTab({ user }: OffersTabProps) {
    return (
         <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">My Offers</h1>
                <p className="text-muted-foreground">Review and respond to job offers you have received.</p>
            </div>
            <OffersList />
        </div>
    );
}
