
'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface ApplicationsByDepartmentChartProps {
    data: { department: string;}[];
}

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ApplicationsByDepartmentChart({ data }: ApplicationsByDepartmentChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications by Department</CardTitle>
        <CardDescription>Total applications for each department in the selected period.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 20)}
              className="text-xs"
            />
            <XAxis dataKey="applications" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="applications" fill="var(--color-applications)" radius={5} layout="vertical" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
