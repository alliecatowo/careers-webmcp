
'use client';

import { Button } from '@/components/ui/button';

export function SkipToContent() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
     const mainContent = document.getElementById('main-content');
     if (mainContent) {
        mainContent.removeAttribute('tabindex');
     }
  }

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      onBlur={handleBlur}
      className="sr-only focus:not-sr-only focus:absolute focus:z-[101] focus:m-4"
    >
      <Button variant="secondary">Skip to main content</Button>
    </a>
  );
}
