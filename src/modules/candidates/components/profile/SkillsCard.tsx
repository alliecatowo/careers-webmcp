
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Candidate } from "@/types";
import { Cpu, Wrench } from "lucide-react";

export function SkillsCard({ candidate }: { candidate: Candidate }) {
    const { skills = [], technologies = [] } = candidate.parsedData || {};

    return (
        <Card>
            <CardHeader><CardTitle>Parsed Skills & Technologies</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-muted-foreground"/>
                        Technologies
                    </h4>
                    {technologies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No technologies parsed.</p>
                    )}
                </div>
                 <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground"/>
                        Skills
                    </h4>
                    {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">No skills parsed.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
