
'use client';
import { Stepper } from '@/components/system/Stepper';
import { usePathname } from 'next/navigation';

export default function ApplicationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const steps = ["Basic Information", "Skills & Projects", "Verification & Submit"];
    
    let currentStep = 0;
    if (pathname.includes('/phase2')) {
        currentStep = 1;
    } else if (pathname.includes('/phase3')) {
        currentStep = 2;
    }

    return (
        <div className="container mx-auto py-12 max-w-4xl space-y-12">
            <Stepper currentStep={currentStep} steps={steps} />
            <div>
                {children}
            </div>
        </div>
    );
}
