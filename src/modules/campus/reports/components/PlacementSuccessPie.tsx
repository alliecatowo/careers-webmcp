
'use client';
import { Pie, PieChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import * as React from 'react';

interface PlacementSuccessPieProps {
    rate: number;
}

export function PlacementSuccessPie({ rate }: PlacementSuccessPieProps) {
    const chartData = [
        { name: 'Placed', value: rate, fill: 'hsl(var(--chart-1))' },
        { name: 'Not Placed', value: 100 - rate, fill: 'hsl(var(--muted))' }
    ];

    const chartConfig = {
        value: { label: '%' }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Overall Placement Rate</CardTitle>
                <CardDescription>Percentage of applications that resulted in a placement.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <React.Fragment key={`cell-${index}`}>
                                {index === 0 && ( // Only render label for the 'Placed' slice
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-foreground text-3xl font-bold"
                                    >
                                        {`${entry.value}%`}
                                    </text>
                                )}
                                </React.Fragment>
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
