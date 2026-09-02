
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageHistory } from "@/types";
import { CheckCircle } from "lucide-react";

interface TimelineTabProps {
    history: StageHistory[];
}

export function TimelineTab({ history }: TimelineTabProps) {
     if (history.length === 0) {
        return <p className="text-muted-foreground">No timeline events found for this candidate.</p>;
    }
    return (
        <Card>
            <CardHeader><CardTitle>Candidate Timeline</CardTitle></CardHeader>
            <CardContent>
                 <ol className="relative border-l border-border">                  
                    {history.map((item, index) => (
                        <li key={item.id} className="mb-10 ml-6">            
                            <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-background">
                                <CheckCircle className="w-4 h-4 text-blue-600"/>
                            </span>
                            <h3 className="flex items-center mb-1 text-base font-semibold">
                                {item.stage.replace('_', ' ')}
                            </h3>
                            <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                                on {new Date(item.timestamp).toLocaleDateString()}
                            </time>
                        </li>
                    ))}
                </ol>
            </CardContent>
        </Card>
    );
}
