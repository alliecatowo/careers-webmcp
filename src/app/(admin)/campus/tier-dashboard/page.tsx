'use client';

import { useEffect, useState, useMemo } from "react";
import { studentService } from "@/services/student.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, PieChart, Pie, Cell, Legend, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { mockStudents } from "@/mocks/students.mock";
import { Loader2, Trophy } from "lucide-react";
import useSWR from "swr";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export default function TierDashboard() {
  const { data: students, isLoading } = useSWR('allStudents', studentService.getAllStudents);

  const tierData = useMemo(() => {
    if (!students) return [];
    
    const tiers: { [key: string]: any[] } = { "1": [], "2": [], "3": [] };
    students.forEach(s => {
      const studentWithType = s as any;
      if (studentWithType.collegeType && tiers[studentWithType.collegeType]) {
        tiers[studentWithType.collegeType].push(studentWithType);
      }
    });

    return Object.keys(tiers).map(tier => {
      const total = tiers[tier].length;
      const placed = tiers[tier].filter(s => s.verified).length;
      const successRate = total ? Math.round((placed / total) * 100) : 0;
      const topStudents = tiers[tier]
        .filter(s => s.verified)
        .sort((a,b)=> (b.aiScore||0) - (a.aiScore||0))
        .slice(0,5);
      return { tier, total, placed, successRate, topStudents };
    });
  }, [students]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">University Tier Placement Dashboard</h1>
        <p className="text-muted-foreground">Analyze placement data based on college tier classification.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tierData.map(t => (
          <Card key={t.tier}>
            <CardHeader>
              <CardTitle>Tier {t.tier} Colleges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-xs text-muted-foreground">Total</p><p className="font-bold text-lg">{t.total}</p></div>
                <div><p className="text-xs text-muted-foreground">Placed</p><p className="font-bold text-lg">{t.placed}</p></div>
                <div><p className="text-xs text-muted-foreground">Success</p><p className="font-bold text-lg">{t.successRate}%</p></div>
              </div>

              <div>
                <h3 className="mt-4 font-semibold text-sm mb-2">Top 5 Placed Students</h3>
                <ul className="space-y-2 text-xs">
                  {t.topStudents.length > 0 ? t.topStudents.map(s=>(
                    <li key={s.id} className="flex justify-between items-center">
                        <span>{s.name} ({s.college})</span>
                        <span className="flex items-center gap-1 font-semibold text-primary"><Trophy className="h-3 w-3"/>{s.aiScore}</span>
                    </li>
                  )) : <p className="text-muted-foreground text-center py-2">No placed students yet.</p>}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Tier-wise Placement Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <BarChart data={tierData.map(t=> ({ tier: "Tier "+t.tier, Placed: t.placed, Total: t.total }))}>
                        <XAxis dataKey="tier" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Total" fill="hsl(var(--muted))" radius={4} />
                        <Bar dataKey="Placed" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle>Success Rate Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <PieChart>
                        <Pie
                            data={tierData.map(t=> ({ name: "Tier "+t.tier, value: t.successRate }))}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                        {tierData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
