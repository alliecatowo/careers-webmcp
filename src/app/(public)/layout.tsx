import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';
import { FloatingJobButton } from '@/components/layout/FloatingJobButton';
import { SkipToContent } from '@/components/system/SkipToContent';
import { AnimatedMain } from '@/components/layout/AnimatedMain';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <SkipToContent />
      <PublicHeader />
      <AnimatedMain>
        {children}
      </AnimatedMain>
      <FloatingJobButton />
      <PublicFooter />
    </div>
  );
}
