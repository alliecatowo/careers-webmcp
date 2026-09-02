'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ApplicationsByCountryChartProps {
  data: { country: string; applications: number }[];
}

const chartConfig = {
  applications: {
    label: 'Applications',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function ApplicationsByCountryChart({
  data,
}: ApplicationsByCountryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications by Country</CardTitle>
        <CardDescription>
          Total applications from each country in the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 30 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 20)}
              className="text-xs"
            />
            <XAxis dataKey="applications" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="applications"
              fill="var(--color-applications)"
              radius={5}
              layout="vertical"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
