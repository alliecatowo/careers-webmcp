
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BarChart } from "lucide-react";
import { Candidate } from "@/types";

const fitCategoryStyles: { [key: string]: string } = {
    STRONG_FIT: 'bg-green-100 text-green-800 border-green-200',
    GOOD_FIT: 'bg-blue-100 text-blue-800 border-blue-200',
    MODERATE_FIT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    WEAK_FIT: 'bg-red-100 text-red-800 border-red-200',
}

export function AISummaryCard({ candidate }: { candidate: Candidate }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    AI-Powered Analysis
                </CardTitle>
                <CardDescription>An automated summary and scoring based on the candidate's resume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div>
                    <h4 className="font-semibold text-sm mb-2">Overall Match</h4>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-primary">{candidate.matchScore || 'N/A'}%</div>
                        {candidate.fitCategory && <Badge variant="outline" className={fitCategoryStyles[candidate.fitCategory]}>{candidate.fitCategory.replace('_', ' ')}</Badge>}
                    </div>
                </div>

                {candidate.summary && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2">AI Summary</h4>
                        <p className="text-sm text-muted-foreground italic">
                            "{candidate.summary}"
                        </p>
                    </div>
                )}
               
                {candidate.riskFlags && candidate.riskFlags.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2 text-destructive">Risk Flags</h4>
                        <div className="flex flex-wrap gap-2">
                            {candidate.riskFlags.map(flag => (
                                <Badge key={flag} variant="destructive">{flag}</Badge>
                            ))}
                        </div>
                    </div>
                )}
                 {candidate.scoreBreakdown && (
                     <div>
                        <h4 className="font-semibold text-sm mb-2">Score Breakdown</h4>
                         <div className="space-y-2 text-sm">
                             {Object.entries(candidate.scoreBreakdown).map(([key, value]) => (
                                 <div key={key} className="flex justify-between items-center">
                                     <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                     <span className="font-medium">{value}%</span>
                                 </div>
                             ))}
                         </div>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
