
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface RequestContextType {
  globalLoading: boolean;
  incrementRequestCount: () => void;
  decrementRequestCount: () => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider = ({ children }: { children: ReactNode }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  const incrementRequestCount = useCallback(() => {
    setActiveRequests((count) => count + 1);
  }, []);

  const decrementRequestCount = useCallback(() => {
    setActiveRequests((count) => Math.max(0, count - 1));
  }, []);

  const value = {
    globalLoading: activeRequests > 0,
    incrementRequestCount,
    decrementRequestCount,
  };

  return (
    <RequestContext.Provider value={value}>{children}</RequestContext.Provider>
  );
};

export const useGlobalRequest = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useGlobalRequest must be used within a RequestProvider');
  }
  return context;
};
