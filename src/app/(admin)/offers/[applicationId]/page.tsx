'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { OfferForm } from '@/modules/offers/components/OfferForm';
import { OfferSummary } from '@/modules/offers/components/OfferSummary';
import { ApprovalChain } from '@/modules/offers/components/ApprovalChain';
import { OfferData, User } from '@/types';
import { offerService } from '@/services/offer.service';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

export default function OfferPage() {
  const { user } = useAuth();
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [offerData, setOfferData] = useState<OfferData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!applicationId) return;
    const fetchOfferData = async () => {
      setIsLoading(true);
      try {
        const data = await offerService.getOfferForApplication(applicationId);
        setOfferData(data);
      } catch (error) {
        console.error('Failed to fetch offer data:', error);
        setOfferData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOfferData();
  }, [applicationId]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="md:col-span-1 space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!offerData || !offerData.application || !offerData.candidate) {
    notFound();
  }
  const { application, candidate, offer } = offerData;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Offer Management
          </h1>
          <p className="text-muted-foreground">
            Creating offer for job: {candidate.jobTitle}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-8">
          {offer ? <OfferSummary /> : user && <OfferForm />}
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{candidate.name}</p>
                <p className="text-sm text-muted-foreground">
                  {candidate.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {offer && user && <ApprovalChain />}
        </div>
      </div>
    </div>
  );
}
