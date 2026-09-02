
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '@/modules/dashboard/components/MetricCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const FunnelStats = ({
  offerRate,
  interviewRate,
}: {
  offerRate: number;
  interviewRate: number;
}) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Hiring Funnel KPIs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <MetricCard 
              title="Offer Conversion Rate"
              value={`${offerRate}%`}
              icon={ offerRate > 50 ? <TrendingUp /> : <TrendingDown />}
              description={ offerRate > 50 ? 'Healthy' : 'Needs Attention'}
            />
             <MetricCard 
              title="Interview Success Rate"
              value={`${interviewRate}%`}
              icon={ interviewRate > 20 ? <TrendingUp /> : <TrendingDown />}
              description={ interviewRate > 20 ? 'Good' : 'Low'}
            />
        </CardContent>
    </Card>
  );
};
