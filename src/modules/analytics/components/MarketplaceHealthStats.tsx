'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MarketplaceHealthStatsProps {
    healthMetrics: {
        avgTimeToSelection: number;
        avgTimeToCompletion: number;
        fillRate: number;
        disputeRate: number;
    }
}

const Metric = ({ title, value, unit }: { title: string, value: number, unit: string }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{value}<span className="text-lg font-normal">{unit}</span></p>
        </CardContent>
    </Card>
)

export function MarketplaceHealthStats({ healthMetrics }: MarketplaceHealthStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Metric title="Avg. Time to Selection" value={healthMetrics.avgTimeToSelection} unit=" days" />
            <Metric title="Avg. Time to Completion" value={healthMetrics.avgTimeToCompletion} unit=" days" />
            <Metric title="Project Fill Rate" value={healthMetrics.fillRate} unit="%" />
            <Metric title="Dispute Rate" value={healthMetrics.disputeRate} unit="%" />
        </div>
    );
}
