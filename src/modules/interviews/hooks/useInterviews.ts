
'use client';

import useSWR from 'swr';
import { interviewService } from '@/services/interview.service';

const INTERVIEWS_KEY = 'interviews';

export const useInterviews = () => {
    const { data, error, isLoading, mutate } = useSWR(INTERVIEWS_KEY, interviewService.getAllInterviews);

    return {
        interviews: data,
        isLoading,
        isError: error,
        mutate,
    };
};
