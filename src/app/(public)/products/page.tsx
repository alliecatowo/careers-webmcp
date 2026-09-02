
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Products",
    description: "Discover the suite of products powering the next generation of global talent acquisition.",
    alternates: {
        canonical: '/products',
    },
    openGraph: {
        title: "Our Products | TalentOS by Baalvion",
        description: "Discover the suite of products powering the next generation of global talent acquisition.",
        url: '/products',
    }
};

export default function ProductsPage() {
    return (
        <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Our Products</h1>
                    <p className="mt-4 text-lg text-muted-foreground">The intelligent infrastructure for global talent operations.</p>
                </div>
            </section>
            <Separator />
             <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12 text-center">
                <p className="text-xl text-muted-foreground">
                    Content for our Products and Services is coming soon.
                </p>
             </div>
        </main>
    );
}
