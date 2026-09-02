
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { studentService } from "@/services/student.service";
import { Student } from "@/modules/students/domain/student.entity";
import { saveAs } from "file-saver";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { MetricCard } from "@/modules/dashboard/components/MetricCard";
import { Users, Building, Percent, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/components/system/Toast/useToast";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const barChartConfig: ChartConfig = {
  placed: {
    label: "Placed",
    color: "hsl(var(--primary))",
  },
};

const lineChartConfig: ChartConfig = {
  successRate: {
    label: "Success Rate %",
    color: "hsl(var(--chart-2))",
  },
};


const PlacementDashboardPro = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filterCollegeType, setFilterCollegeType] = useState("");
  const [filterCompany, setFilterCompany] = useState("");

  useEffect(() => {
    studentService.getAllStudents().then(data => {
      const studentsWithDetails = data.map(s => ({
        ...s,
        verified: Math.random() > 0.5,
        aiScore: Math.random() > 0.3 ? 50 + Math.floor(Math.random() * 50) : null,
      })) as Student[];
      setStudents(studentsWithDetails);
    });
  }, []);

  const companies = useMemo(() => [...new Set(students.map((s) => (s as any).company))], [students]);
  const collegeTypes = useMemo(() => [...new Set(students.map(s => (s as any).collegeType))], [students]);

  // AI verification simulation
  const verifyDocument = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, verified: true, aiScore: Math.floor(Math.random() * 15) + 85 }
          : s
      )
    );
    showToast({ 
      type: 'success', 
      title: 'Document Verified', 
      description: 'Document Verified' // You can customize this message
    });
  };

  const sendNotification = (studentId: string) => {
    const student = students.find(s => s.studentId === studentId);
    showToast({ type: 'info', title: 'Notification Sent', description: `Simulated notification sent to ${student?.name}.` });
  };

  // Filtered students
  const displayedStudents = useMemo(() => {
    return students.filter((s) => {
      const studentData = s as any;
      const matchSearch = studentData.name.toLowerCase().includes(search.toLowerCase());
      const matchCollege = filterCollegeType ? studentData.collegeType === filterCollegeType : true;
      const matchCompany = filterCompany ? studentData.company === filterCompany : true;
      return matchSearch && matchCollege && matchCompany;
    });
  }, [students, search, filterCollegeType, filterCompany]);

  // Stats
  const totalPlaced = students.filter((s) => (s as any).verified).length;
  const totalCompanies = new Set(students.map((s) => (s as any).company)).size;
  const successRate = students.length > 0 ? Math.round((totalPlaced / students.length) * 100) : 0;

  // Trend data for bar chart
  const trendData = collegeTypes.map((type) => ({
    tier: `Tier ${type}`,
    placed: students.filter((s) => (s as any).collegeType === type && (s as any).verified).length,
  }));

  // Pie chart for company distribution
  const companyDistribution = companies.map(c => ({
    name: c,
    value: students.filter(s => (s as any).company === c && (s as any).verified).length
  })).filter(c => c.value > 0);

  // Yearly trend mock data
  const yearlyTrend = useMemo(() => {
    const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
    return years.map(year => {
      const yearSuccessRate = Math.min(100, Math.max(60, 60 + Math.random()*40));
      return { year, successRate: Math.round(yearSuccessRate) };
    });
  }, []);


  // Download CSV
  const downloadCSV = () => {
    const header = ["Name", "College", "Type", "Company", "Role", "Verified", "AI Score"];
    const rows = displayedStudents.map((s: any) => [
      s.name,
      s.college,
      s.collegeType,
      s.company,
      s.role,
      s.verified ? "Yes" : "No",
      s.aiScore || "-"
    ]);
    const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "placements.csv");
  };

  // AI Highlights: Top 5 students per company
  const topStudentsByCompany = useMemo(() => {
    const result: Record<string, Student[]> = {};
    companies.forEach(company => {
      result[company] = students
        .filter((s: any) => s.company === company && s.verified && s.aiScore)
        .sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0))
        .slice(0, 5);
    });
    return result;
  }, [students, companies]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Baalvion Industries Campus Placement Dashboard</h1>
        <p className="text-muted-foreground">Monitor campus hiring metrics and manage student placements.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard title="Total Students Placed" value={totalPlaced} icon={<Users />} />
        <MetricCard title="Partner Companies" value={totalCompanies} icon={<Building />} />
        <MetricCard title="Placement Success Rate" value={`${successRate}%`} icon={<Percent />} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Placement Trends by College Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig} className="h-[250px] w-full">
              <BarChart data={trendData}>
                <XAxis dataKey="tier" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="placed" fill="var(--color-placed)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Placement Distribution by Company</CardTitle>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[250px] w-full">
              <PieChart>
                <Pie
                  data={companyDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  label
                >
                  {companyDistribution.map((entry, index) => (
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
      
      {/* Yearly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Predicted Placement Success Trend</CardTitle>
          <CardDescription>Mock success rate over the last 5 years.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
            <LineChart
              data={yearlyTrend}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[50, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke="var(--color-successRate)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>


       {/* AI Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Placement Highlights</CardTitle>
          <CardDescription>Top 5 verified students with the highest AI scores for each partner company.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(topStudentsByCompany).filter(([, topStudents]) => topStudents.length > 0).map(([company, topStudents]) => (
            <div key={company} className="p-4 border rounded-lg">
              <h4 className="font-bold mb-2">{company}</h4>
              <ul className="space-y-2">
                {topStudents.map((s: any) => (
                  <li key={s.id} className="text-sm flex items-center justify-between">
                    <span>{s.name} <span className="text-xs text-muted-foreground">({s.college})</span></span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3"/> {s.aiScore}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <CardTitle>Student Placement Data</CardTitle>
                    <CardDescription>Review and manage individual student placements.</CardDescription>
                </div>
                 <div className="flex gap-2 flex-wrap">
                    <Input
                      placeholder="Search student"
                      value={search}
                      onChange={e=>setSearch(e.target.value)}
                      className="w-full sm:w-auto"
                    />
                    <Select onValueChange={(value) => setFilterCollegeType(value === 'all' ? '' : value)} value={filterCollegeType || 'all'}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        {collegeTypes.map(t=><SelectItem key={t} value={t}>Tier {t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                     <Select onValueChange={(value) => setFilterCompany(value === 'all' ? '' : value)} value={filterCompany || 'all'}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Company" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="all">All Companies</SelectItem>
                        {companies.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={downloadCSV}>Download CSV</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedStudents.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.college}</TableCell>
                  <TableCell>{s.collegeType}</TableCell>
                  <TableCell>{s.company}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>
                    {s.verified ? (
                      <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>{s.aiScore || "-"}</TableCell>
                  <TableCell className="flex gap-2 justify-end">
                    {!s.verified && (
                      <Button size="sm" onClick={() => verifyDocument(s.studentId)}>
                        Verify Doc
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => sendNotification(s.studentId)}>
                      Notify
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlacementDashboardPro;
