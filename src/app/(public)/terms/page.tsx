
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the terms and conditions for using the Baalvion talent acquisition platform.",
    alternates: {
        canonical: '/terms',
    },
    openGraph: {
        title: "Terms of Service | TalentOS by Baalvion",
        description: "Read the terms and conditions for using the Baalvion talent acquisition platform.",
        url: '/terms'
    }
};

export default function TermsOfServicePage() {
    return (
        <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </section>
            <Separator />
             <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12">
                <p className="text-lg text-muted-foreground">
                    Content for our Terms of Service is coming soon. This document will outline the rules and guidelines for using the Baalvion platform for both candidates and employers. It will cover topics such as account responsibilities, data usage, acceptable conduct, and limitations of liability.
                </p>
             </div>
        </main>
    );
}
