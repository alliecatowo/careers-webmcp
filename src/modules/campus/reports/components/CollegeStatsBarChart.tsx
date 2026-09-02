
'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ScrollArea } from '@/components/ui/scroll-area';

interface CollegeStatsBarChartProps {
    data: { college: string; applications: number; placed: number; }[];
}

const chartConfig = {
    applications: {
        label: "Applications",
        color: "hsl(var(--chart-2))",
    },
     placed: {
        label: "Placed",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CollegeStatsBarChart({ data }: CollegeStatsBarChartProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Performance by College</CardTitle>
                <CardDescription>Total applications and placements from each partner college.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                        <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 50, right: 20 }}>
                            <CartesianGrid horizontal={false} />
                            <YAxis
                                dataKey="college"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.length > 20 ? `${value.slice(0, 20)}...` : value}
                                className="text-xs"
                            />
                            <XAxis dataKey="applications" type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="applications" fill="var(--color-applications)" radius={4} layout="vertical" />
                            <Bar dataKey="placed" fill="var(--color-placed)" radius={4} layout="vertical" />
                        </BarChart>
                    </ChartContainer>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
