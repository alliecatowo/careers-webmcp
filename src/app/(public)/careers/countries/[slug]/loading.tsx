
import { Skeleton } from "@/components/ui/skeleton";

export default function CountryLoading() {
  return (
    <main className="bg-background">
      <div className="container mx-auto py-16 lg:py-24">
        {/* Header Skeleton */}
        <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-16 w-2/3 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        {/* Job List Skeleton */}
        <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </main>
  );
}
