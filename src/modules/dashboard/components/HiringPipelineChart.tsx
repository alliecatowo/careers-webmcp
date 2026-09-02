"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  count: {
    label: "Candidates",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface HiringPipelineChartProps {
    data: { stage: string; count: number }[];
}

export function HiringPipelineChart({ data }: HiringPipelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Pipeline Overview</CardTitle>
        <CardDescription>Number of active candidates in each stage.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="stage"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs"
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={5} layout="vertical" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
