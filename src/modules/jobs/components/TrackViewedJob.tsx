'use client';

import { useEffect } from 'react';

const RECENTLY_VIEWED_KEY = 'recentlyViewedJobs';
const MAX_RECENTLY_VIEWED = 5;

export function TrackViewedJob({ jobId }: { jobId: string }) {
  useEffect(() => {
    if (!jobId) return;

    try {
      const storedValue = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const recentlyViewed: string[] = storedValue ? JSON.parse(storedValue) : [];
      
      // Remove the job if it already exists to move it to the front
      const updatedList = recentlyViewed.filter(id => id !== jobId);
      
      // Add the current job to the front
      updatedList.unshift(jobId);

      // Trim the list to the max size
      const trimmedList = updatedList.slice(0, MAX_RECENTLY_VIEWED);

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(trimmedList));
    } catch (error) {
      console.error("Could not update recently viewed jobs:", error);
    }
  }, [jobId]);

  return null; // This component does not render anything
}
