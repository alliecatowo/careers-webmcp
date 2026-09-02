
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Studio",
    description: "Where innovation in talent acquisition is engineered.",
    alternates: {
        canonical: '/studio',
    },
    openGraph: {
        title: "Our Studio | TalentOS by Baalvion",
        description: "Where innovation in talent acquisition is engineered.",
        url: '/studio',
    }
};

export default function StudioPage() {
    return (
        <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Our Studio</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Where innovation in talent acquisition is engineered.</p>
                </div>
            </section>
            <Separator />
             <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12 text-center">
                <p className="text-xl text-muted-foreground">
                    Content for Our Studio coming soon.
                </p>
             </div>
        </main>
    );
}
