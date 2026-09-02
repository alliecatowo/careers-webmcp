
import { Skeleton } from "@/components/ui/skeleton";

export default function JobLoading() {
  return (
    <main className="bg-background">
      <div className="container mx-auto py-16 lg:py-24 max-w-4xl">
        {/* Header Skeleton */}
        <div className="space-y-4 mb-12">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
            </div>
        </div>

        <div className="grid md:grid-cols-4 gap-12">
            {/* Main Content Skeleton */}
            <div className="md:col-span-3 space-y-10">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
                 <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
            </div>

            {/* Sidebar Skeleton */}
            <aside className="md:col-span-1">
                <Skeleton className="h-64 w-full" />
            </aside>
        </div>
      </div>
    </main>
  );
}
