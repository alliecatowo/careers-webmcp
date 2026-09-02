
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const pipelineStages = [
    { name: "Internship", description: "Gain real-world experience." },
    { name: "Part-Time", description: "Contribute flexibly while you learn." },
    { name: "Full-Time", description: "Join us as a core team member." },
    { name: "Leadership", description: "Shape the future of the company." },
];

export function HiringPipelineDiagram() {
    return (
        <Card className="bg-muted/30">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold tracking-tight">Career Pathways at Baalvion</CardTitle>
                <CardDescription>From foundational experience to global leadership.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative flex items-center justify-between">
                    {pipelineStages.map((stage, index) => (
                        <div key={stage.name} className="relative z-10 flex-1 text-center">
                             <div className="flex justify-center items-center">
                                <div className="h-24 w-24 rounded-full border-2 border-primary/20 bg-background flex flex-col items-center justify-center text-sm font-bold text-primary p-2">
                                    <span>{stage.name}</span>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground max-w-[120px] mx-auto">{stage.description}</p>
                        </div>
                    ))}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-12" aria-hidden="true"></div>
                </div>
            </CardContent>
        </Card>
    );
}
