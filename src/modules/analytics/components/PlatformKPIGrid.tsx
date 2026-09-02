'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlatformMetrics } from "../domain/analytics.entity";
import { formatCurrency } from "@/lib/utils/currency";

interface PlatformKPIGridProps {
  kpis: PlatformMetrics;
}

const Metric = ({ title, value, isCurrency = false }: { title: string, value: number, isCurrency?: boolean }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{isCurrency ? formatCurrency(value, 'USD') : value}</p>
        </CardContent>
    </Card>
)

export function PlatformKPIGrid({ kpis }: PlatformKPIGridProps) {
  return (
    <>
      <Metric title="Total Revenue Processed" value={kpis.totalRevenueProcessed.value} isCurrency />
      <Metric title="Escrow Locked Value" value={kpis.totalEscrowLocked.value} isCurrency />
      <Metric title="Platform Commission (Est.)" value={kpis.platformCommissionEarned.value} isCurrency />
    </>
  );
};
