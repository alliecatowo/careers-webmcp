
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Zap } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Performance-Based Internship Program (India) | Baalvion Careers",
    description: "Join Baalvion's merit-driven, performance-focused internship program in India. A direct pathway to a full-time role for top performers.",
};

const specializations = [
    "Full-Stack Engineering (React, Go)",
    "Cloud & DevOps Engineering (AWS, Kubernetes)",
    "Data Science & Machine Learning",
    "Product Management",
    "UX/UI Design",
    "Talent Acquisition & HR Tech"
];

const competencies = [
    "Technical Proficiency",
    "Problem-Solving & Critical Thinking",
    "Ownership & Accountability",
    "Communication & Collaboration",
    "Adaptability & Learning Agility"
];

export default function InternshipProgramPage() {
    return (
        <main className="bg-background text-foreground">
            <section className="py-24 sm:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Performance-Based Internship Program (India)</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        A merit-driven launchpad for the next generation of tech leaders, exclusively at our India headquarters.
                    </p>
                </div>
            </section>

            <div className="container mx-auto py-16 lg:py-24 max-w-5xl space-y-16">
                
                <section>
                    <h2 className="text-3xl font-bold tracking-tight text-center">Program Philosophy: Meritocracy in Action</h2>
                    <p className="mt-4 text-lg text-muted-foreground text-center max-w-3xl mx-auto">
                        Our internship is not a typical program. It is an extended, high-stakes evaluation designed to identify and cultivate top-tier talent. We believe in rewarding performance, not just participation. Your compensation, responsibilities, and pathway to a full-time role are directly tied to your demonstrated competency and impact.
                    </p>
                </section>
                
                <section>
                     <h2 className="text-3xl font-bold tracking-tight text-center mb-10">6 Specialization Tracks</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specializations.map(track => (
                            <Card key={track} className="bg-card">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <Zap className="h-6 w-6 text-primary" />
                                    <span className="font-semibold">{track}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="grid md:grid-cols-2 gap-12 items-center">
                     <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-6">Core Competency Framework</h2>
                        <p className="text-muted-foreground mb-6">
                            You will be rigorously assessed against our five core competencies. Mastery in these areas is non-negotiable for progressing within Baalvion.
                        </p>
                        <ul className="space-y-4">
                           {competencies.map(item => (
                               <li key={item} className="flex items-start gap-3">
                                   <Check className="h-6 w-6 text-green-500 mt-1 shrink-0" />
                                   <span className="text-lg">{item}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle>Performance-Based Compensation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-muted-foreground">
                                Your monthly stipend is determined by your performance tier, reviewed at the end of each month. Exceptional impact is rewarded immediately.
                            </p>
                            <div className="text-center p-6 border rounded-lg bg-background">
                                <p className="text-sm text-muted-foreground">Stipend Range</p>
                                <p className="text-3xl font-bold">₹40,000 - ₹90,000 / month</p>
                                <p className="text-xs text-muted-foreground mt-1">Based on monthly performance review</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="text-center">
                     <h2 className="text-3xl font-bold tracking-tight">Pathway to a Full-Time Role</h2>
                     <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                        This is not just an internship; it's your interview for a full-time position. Interns who consistently exceed expectations and demonstrate mastery of our core competencies will receive a Pre-Placement Offer (PPO) to join Baalvion as a full-time employee upon graduation.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" asChild>
                            <Link href="/careers/open-positions?jobType=Internship">Apply to the Internship Program</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </main>
    );
}
