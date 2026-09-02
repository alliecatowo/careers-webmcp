
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Hiring Process | Baalvion Careers",
    description: "Learn about Baalvion's transparent, four-step hiring process designed to identify the best talent.",
};

const hiringProcessSteps = [
    { number: "01", name: "Apply", description: "Submit your application for an open role that matches your skills and interests via our careers portal." },
    { number: "02", name: "Interview", description: "Meet with our talent acquisition team and hiring managers to discuss your experience, skills, and cultural alignment." },
    { number: "03", name: "Assessment", description: "Participate in a role-specific, skills-based assessment. This could be a technical challenge, a case study, or a portfolio review." },
    { number: "04", name: "Offer", description: "Successful candidates receive a competitive, comprehensive offer to join our global team." },
];

export default function HiringProcessPage() {
    return (
         <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Our Hiring Process</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        A straightforward and transparent process designed to find the best fit for both you and our team.
                    </p>
                </div>
            </section>

             <section id="hiring-process" className="py-24 lg:py-32">
                 <div className="container mx-auto px-4">
                    <div className="relative">
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-border -translate-y-1/2" aria-hidden="true"></div>
                        <div className="relative grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                            {hiringProcessSteps.map((step) => (
                                <div key={step.name} className="text-center relative bg-background px-4">
                                <div className="flex justify-center items-center">
                                        <div className="h-16 w-16 rounded-full border-2 border-primary/20 bg-background flex items-center justify-center text-xl font-bold text-primary">
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold">{step.name}</h3>
                                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
