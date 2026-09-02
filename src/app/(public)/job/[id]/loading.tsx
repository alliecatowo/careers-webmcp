
import { LoadingState } from '@/components/system/LoadingState'

export default function Loading() {
  return (
    <main className="container mx-auto py-16 lg:py-24">
        <LoadingState message="Loading job details..." />
    </main>
  )
}
