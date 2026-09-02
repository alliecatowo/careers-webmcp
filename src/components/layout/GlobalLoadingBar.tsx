'use client';
import { useGlobalRequest } from '@/lib/request/request.context';

export function GlobalLoadingBar() {
  const { globalLoading } = useGlobalRequest();

  if (!globalLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[101]">
      <div className="h-full bg-primary animate-global-loading"></div>
    </div>
  );
}
