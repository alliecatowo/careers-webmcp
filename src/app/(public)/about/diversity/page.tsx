
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Diversity & Inclusion | TalentOS",
    description: "Learn about Baalvion's commitment to building a diverse and inclusive workplace that reflects the world's talent.",
    openGraph: {
        title: "Diversity & Inclusion | TalentOS",
        description: "Learn about Baalvion's commitment to building a diverse and inclusive workplace.",
    }
};

export default function DiversityPage() {
    return (
        <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Diversity & Inclusion</h1>
                    <p className="mt-4 text-lg text-muted-foreground">Building a platform that reflects the world's talent.</p>
                </div>
            </section>
            <Separator />
             <div className="container mx-auto py-16 lg:py-24 max-w-4xl space-y-12">
                 <p className="text-lg text-muted-foreground">
                    At Baalvion, our mission is to create a fair, intelligent, and transparent ecosystem where skill is the only currency that matters. This mission begins with us. We are committed to building a diverse and inclusive workplace where all team members feel valued, respected, and empowered. We believe that diverse teams build better products, make better decisions, and better reflect the global community of talent we serve. We welcome and encourage applicants from all backgrounds, experiences, and identities to apply.
                </p>
             </div>
        </main>
    );
}
