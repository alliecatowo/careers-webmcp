
'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface JobDistributionBarChartProps {
    data: { job: string; count: number }[];
}

const chartConfig = {
    applications: {
        label: "Applications",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

export function JobDistributionBarChart({ data }: JobDistributionBarChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Distribution by Job</CardTitle>
                <CardDescription>Number of applications for each open job role.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis 
                            dataKey="job" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={10} 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                            tickFormatter={(value) => value.length > 15 ? `${value.slice(0, 15)}...` : value}
                        />
                        <YAxis />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="applications" fill="var(--color-applications)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
