
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Cpu, Gem, Globe, Scale, Shield, Zap, Target, BrainCircuit, Network, ScaleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { AppConfig } from "@/config/app.config";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Baalvion's mission to build the intelligent infrastructure that connects exceptional talent with borderless opportunity.",
    alternates: {
      canonical: `/about`,
    },
    openGraph: {
      title: "About Us | TalentOS by Baalvion",
      description: "Learn about Baalvion's mission to build the intelligent infrastructure that connects exceptional talent with borderless opportunity.",
      url: `/about`,
    }
};


const ValueCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-background rounded-lg p-6">
        <div className="flex items-center gap-4">
            {icon}
            <h3 className="text-2xl font-semibold">{title}</h3>
        </div>
        <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="border bg-card p-6 rounded-lg">
        <div className="flex items-start gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-md">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-1 text-muted-foreground">{description}</p>
            </div>
        </div>
    </div>
);


export default function AboutPage() {
    return (
        <main className="bg-background text-foreground">

            {/* 1. Hero Section */}
            <section className="py-24 sm:py-32 lg:py-40 text-center bg-muted/30">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">The Operating System for Global Talent</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                        We are building the intelligent infrastructure that connects exceptional talent with borderless opportunity.
                    </p>
                    <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-primary">
                        Baalvion Industries Pvt Ltd // Jobs.Baalvion.com
                    </p>
                </div>
            </section>
            
            <Separator />

            {/* 2. Our Mission */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Mission</h2>
                        <p className="mt-6 text-lg text-muted-foreground">
                            Talent is globally distributed; opportunity is not. Traditional hiring is constrained by geography, bias, and inefficiency. Baalvion exists to dismantle these barriers. We are creating a fair, intelligent, and transparent ecosystem where skill is the only currency that matters.
                        </p>
                    </div>
                    <div className="bg-muted/50 p-8 rounded-lg border">
                         <blockquote className="text-xl md:text-2xl font-semibold leading-snug">
                             “To unlock the world's human potential by building the infrastructure for truly meritocratic, borderless hiring.”
                         </blockquote>
                    </div>
                </div>
            </section>

             {/* 3. Our Vision */}
            <section className="py-20 lg:py-32 bg-muted/30">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                     <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our 10-Year Vision</h2>
                     <p className="mt-6 text-xl text-muted-foreground">
                        We envision a future where any organization can seamlessly hire the best talent from any nation. Baalvion will be the foundational layer—the global rails—upon which this new, multi-country, multi-organization ecosystem runs. Secure, compliant, and intelligent by default.
                    </p>
                </div>
            </section>
            
            {/* 4. What We Are Building */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Baalvion Platform</h2>
                        <p className="mt-4 text-lg text-muted-foreground">This is not another job board. We are engineering a deeply integrated system for enterprise-grade talent acquisition.</p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                       <FeatureCard 
                            icon={<BrainCircuit className="h-6 w-6" />}
                            title="AI Resume Intelligence"
                            description="Moving beyond keywords to deeply understand a candidate's skills, experience, and potential trajectory."
                        />
                        <FeatureCard 
                            icon={<Target className="h-6 w-6" />}
                            title="Smart Candidate Scoring"
                            description="A multi-vector scoring engine that provides a holistic view of candidate-job alignment, free from human bias."
                        />
                         <FeatureCard 
                            icon={<Globe className="h-6 w-6" />}
                            title="Global Talent Infrastructure"
                            description="A compliant, multi-region architecture designed for cross-border hiring, payments, and compliance from day one."
                        />
                        <FeatureCard 
                            icon={<Network className="h-6 w-6" />}
                            title="Multi-Tenant SaaS Architecture"
                            description="Secure, isolated environments for every organization, ensuring data privacy and enterprise-level control."
                        />
                         <FeatureCard 
                            icon={<Scale className="h-6 w-6" />}
                            title="Enterprise Hiring Dashboard"
                            description="A unified command center for analytics, pipeline management, and strategic workforce planning."
                        />
                        <FeatureCard 
                            icon={<Shield className="h-6 w-6" />}
                            title="Compliance & Data Privacy"
                            description="Built with a privacy-first mindset, engineered to meet global data protection standards like GDPR and CCPA."
                        />
                    </div>
                </div>
            </section>

             {/* 5. Why We Exist */}
            <section className="py-20 lg:py-32 bg-muted/30">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                     <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Problem with Yesterday's Hiring</h2>
                        <ul className="mt-6 space-y-4 text-lg text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <ArrowRight className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <span><span className="font-semibold text-foreground">Inefficient Filtering:</span> Valuable candidates are lost in a sea of irrelevant resumes and keyword-matching noise.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <ArrowRight className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <span><span className="font-semibold text-foreground">Geographic & Unconscious Bias:</span> Talent is overlooked due to location, name, or background signals.</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <ArrowRight className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <span><span className="font-semibold text-foreground">Lack of Global Access:</span> Companies struggle to compliantly hire and manage talent across borders.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="border-l-4 border-primary pl-8">
                        <p className="text-xl font-medium text-foreground">
                            Baalvion solves this by abstracting away the complexity. We replace manual, biased processes with an intelligent, data-driven system that surfaces the right talent for the right role, regardless of geography.
                        </p>
                    </div>
                </div>
            </section>

            {/* 6. Technology Philosophy */}
            <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                     <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Engineered for Trust & Scale</h2>
                     <p className="mt-6 text-lg text-muted-foreground">
                        Our platform is built on a foundation of enterprise-grade principles. We treat security, scalability, and data privacy not as features, but as core architectural requirements. Our multi-region infrastructure is designed for high availability and low latency, ensuring a seamless experience for our global user base.
                    </p>
                </div>
            </section>

            {/* 7. Global Commitment */}
             <section className="py-20 lg:py-32 bg-muted/30">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-4">
                         <Badge variant="secondary">Our Philosophy</Badge>
                         <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Skill Over Geography.</h2>
                         <p className="text-lg text-muted-foreground">
                           We fundamentally believe that the best person for the job should get the job, regardless of their passport. Our entire platform is engineered to support this vision of a truly global, meritocratic workforce. We are committed to building tools that promote fairness, dismantle bias, and create economic opportunity for all.
                        </p>
                    </div>
                    <div className="flex justify-center">
                        <Globe className="h-48 w-48 text-primary/20" />
                    </div>
                </div>
            </section>

            {/* 8. Founder's Vision */}
             <section className="py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Founder's Vision</p>
                     <blockquote className="mt-4 text-2xl md:text-4xl font-semibold leading-tight">
                         “We are not building another hiring app. We are engineering the digital infrastructure for the next generation of the global workforce. This is a long-term mission.”
                     </blockquote>
                </div>
            </section>

             {/* 9. Core Values */}
            <section className="py-20 lg:py-32 bg-muted/30">
                 <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Our Core Values</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Our principles guide our decisions, our code, and our culture.</p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                         <ValueCard icon={<Target className="h-8 w-8 text-primary" />} title="Precision" description="We are deliberate and rigorous in our work. From system design to user experience, every detail matters." />
                         <ValueCard icon={<Shield className="h-8 w-8 text-primary" />} title="Integrity" description="We build trust through transparency and by honoring our commitments to users and partners." />
                         <ValueCard icon={<BrainCircuit className="h-8 w-8 text-primary" />} title="Intelligence" description="We leverage data and AI not as a gimmick, but to create genuinely smarter, fairer outcomes." />
                         <ValueCard icon={<Scale className="h-8 w-8 text-primary" />} title="Long-Term Thinking" description="We make decisions for the decade, not the quarter, building resilient and future-proof systems." />
                         <ValueCard icon={<Gem className="h-8 w-8 text-primary" />} title="Excellence" description="We hold ourselves to the highest standards, striving to build a platform that is best-in-class." />
                         <ValueCard icon={<Zap className="h-8 w-8 text-primary" />} title="Velocity" description="We move with urgency and focus, shipping meaningful improvements at a rapid pace." />
                    </div>
                </div>
            </section>

            {/* 10. Call to Action */}
            <section className="py-24 lg:py-32 text-center">
                <div className="container mx-auto px-4">
                     <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Join Us in Building the Future</h2>
                     <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Whether you're looking to join our team or partner with us, we're always seeking those who share our vision.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button size="lg" asChild>
                            <Link href={`/careers#open-positions`}>View Open Roles</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href={`/contact`}>Partner With Us</Link>
                        </Button>
                    </div>
                </div>
            </section>

        </main>
    )
}
