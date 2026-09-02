interface Breadcrumb {
  label: string;
  href: string;
}

export function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const pathSegments = pathname.split('/').filter(p => p);

  if (pathSegments.length === 0) return [];
  
  const breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard', href: '/analytics' }];

  let currentHref = '';
  pathSegments.forEach(segment => {
    currentHref += `/${segment}`;
    
    // A simple heuristic to avoid adding UUIDs/IDs to breadcrumbs
    const isIdSegment = /^[0-9a-f-]{10,}|^\d+$/.test(segment);
    
    if (!isIdSegment) {
       breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentHref,
       });
    }
  });
  
  // Remove duplicates that might arise from index pages
  const uniqueCrumbs = breadcrumbs.reduce((acc, current) => {
    if (!acc.find(item => item.label === current.label)) {
      acc.push(current);
    }
    return acc;
  }, [] as Breadcrumb[]);

  return uniqueCrumbs;
}
