import { Metadata } from "next";
import { HiringPipelineDiagram } from "@/modules/talent-acquisition/components/HiringPipelineDiagram";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const metadata: Metadata = {
    title: "Our Hiring Strategy | Baalvion Careers",
    description: "Learn about Baalvion's data-driven, globally-minded approach to building a world-class team.",
};

const hiringPrinciples = [
    "Merit-based evaluations over pedigree.",
    "Skills-based assessments for practical validation.",
    "Structured, consistent interview process to reduce bias.",
    "Global compensation parity based on role and impact.",
    "Continuous feedback loop for process improvement."
];

export default function HiringStrategyPage() {
    return (
         <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Our Hiring Strategy</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        A systematic, data-driven approach to identifying and cultivating exceptional talent worldwide.
                    </p>
                </div>
            </section>

             <div className="container mx-auto py-16 lg:py-24 max-w-5xl space-y-16">
                <section>
                    <h2 className="text-3xl font-bold tracking-tight text-center">Identifying Global Excellence</h2>
                    <p className="mt-4 text-lg text-muted-foreground text-center max-w-3xl mx-auto">
                        Our growth plan is not about filling seats; it's about strategic capability acquisition. We hire deliberately in regions that offer deep talent pools aligned with our long-term technology and business roadmap. Our framework is designed to find the best, wherever they are.
                    </p>
                </section>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Core Hiring Principles</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                        {hiringPrinciples.map(item => (
                            <div key={item} className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                                <span className="text-lg">{item}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <HiringPipelineDiagram />

            </div>
        </main>
    );
}
