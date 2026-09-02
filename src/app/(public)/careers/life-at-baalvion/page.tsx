
import { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = {
    title: "Life at Baalvion | Baalvion Careers",
    description: "Discover the culture, values, and what it's like to work at Baalvion.",
};

export default function LifeAtBaalvionPage() {
    return (
         <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Life at Baalvion</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Where innovation in talent acquisition is engineered.</p>
                </div>
            </section>
            <Separator />
             <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12 text-center">
                <p className="text-xl text-muted-foreground">
                    Content for Life at Baalvion is coming soon. This section will showcase our company culture, team stories, and the values that drive us.
                </p>
             </div>
        </main>
    );
}
