
import { KPICard } from './KPICard';
import { Briefcase, FileText, Clock, Percent } from 'lucide-react';
import { KpiData } from '../domain/analytics.entity';

interface KPIGridProps {
  kpis: KpiData;
}

export const KPIGrid = ({ kpis }: KPIGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard 
        title="Active Jobs" 
        value={kpis.totalActiveJobs.value} 
        change={kpis.totalActiveJobs.change} 
        icon={<Briefcase />} 
      />
      <KPICard 
        title="Total Applications" 
        value={kpis.totalApplications.value} 
        change={kpis.totalApplications.change} 
        icon={<FileText />} 
      />
      <KPICard 
        title="Avg. Time to Fill" 
        value={kpis.avgTimeToFill.value} 
        change={kpis.avgTimeToFill.change} 
        icon={<Clock />} 
        unit=" days"
      />
      <KPICard 
        title="Conversion Rate" 
        value={kpis.overallConversionRate.value} 
        change={kpis.overallConversionRate.change} 
        icon={<Percent />} 
        unit="%"
      />
    </div>
  );
};
