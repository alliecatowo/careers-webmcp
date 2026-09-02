'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { generateBreadcrumbs } from '@/lib/navigation/breadcrumb.engine';

export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = generateBreadcrumbs(pathname);

  if (crumbs.length <= 1) {
    return <h1 className="text-xl font-semibold">Dashboard</h1>;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <Link
            href={crumb.href}
            className={`font-medium ${
              index === crumbs.length - 1
                ? 'text-foreground pointer-events-none'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {crumb.label}
          </Link>
          {index < crumbs.length - 1 && (
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
