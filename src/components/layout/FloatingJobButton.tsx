
'use client';
import Link from 'next/link';

export function FloatingJobButton() {
  return (
    <Link
      href={`/careers/open-positions`}
      className="fixed top-1/2 right-0 z-50 -translate-y-1/2"
      aria-label="Check open positions"
    >
      <div className="flex h-24 items-center justify-center rounded-l-md bg-primary px-2 py-4 text-primary-foreground shadow-lg transition-transform duration-300 ease-in-out hover:bg-primary/90">
        <span className="font-semibold uppercase tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Jobs
        </span>
      </div>
    </Link>
  );
}
