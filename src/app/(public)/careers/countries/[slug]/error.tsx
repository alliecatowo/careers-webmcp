
'use client'

import { ErrorState } from '@/components/system/ErrorState'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="container mx-auto py-16 lg:py-24">
        <ErrorState message={error.message} onRetry={reset} />
    </main>
  )
}
