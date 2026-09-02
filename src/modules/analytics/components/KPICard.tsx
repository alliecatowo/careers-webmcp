
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  unit?: string;
}

export const KPICard = ({ title, value, change, icon, unit }: KPICardProps) => {
  const isPositive = change >= 0;
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}{unit}</div>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground flex items-center">
                {isPositive ? <TrendingUp className="h-4 w-4 mr-1 text-green-500"/> : <TrendingDown className="h-4 w-4 mr-1 text-red-500"/>}
                <span className={isPositive ? 'text-green-500' : 'text-red-500'}>{change.toFixed(1)}%</span>
                &nbsp;vs previous period
            </p>
        </CardFooter>
    </Card>
  );
};
