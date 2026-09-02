'use client';
import useSWR from 'swr';
import { offerService } from '@/services/offer.service';

const OFFERS_KEY = 'offers';

export const useOffers = () => {
    const { data, error, isLoading, mutate } = useSWR(OFFERS_KEY, offerService.getAll);

    return {
        offers: data,
        isLoading,
        isError: error,
        mutate,
    };
};
