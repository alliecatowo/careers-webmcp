
'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportRequest, ReportType, ReportFormat, GeneratedReport, reportTypes, reportFormats } from '@/modules/reporting/types';
import { ReportEngine } from '@/modules/reporting/ReportEngine';
import { useToast } from '@/components/system/Toast/useToast';
import { Loader2, Download, FileText, CalendarClock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const reportEngine = new ReportEngine();

export default function ReportsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reportType, setReportType] = useState<ReportType>('JOB_PERFORMANCE');
  const [reportFormat, setReportFormat] = useState<ReportFormat>('CSV');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

  const handleGenerateReport = async () => {
    if (!user) {
        showToast({type: 'error', title: 'Authentication Error', description: 'You must be logged in to generate reports.' });
        return;
    }
    setIsGenerating(true);
    
    // In a real app, this would be an API call. Here we simulate it.
    try {
        const request: ReportRequest = {
            id: `req-${Date.now()}`,
            type: reportType,
            format: reportFormat,
            filters: {}, // Add filter UI later
            requestedBy: user.id,
            userRole: user.role, // Pass user role for RBAC
            createdAt: new Date()
        };
        const report = await reportEngine.generateReport(request);
        setGeneratedReports(prev => [report, ...prev]);
        showToast({type: 'success', title: 'Report Generated', description: `${report.fileName} is ready for download.` });
    } catch (error: any) {
        showToast({type: 'error', title: 'Generation Failed', description: error.message });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and download detailed reports on platform activity.</p>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Select the type and format of the report you want to generate.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                          {reportTypes.map(type => (
                            <SelectItem key={type} value={type}>{type.replace(/_/g, ' ')}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <Select value={reportFormat} onValueChange={(v) => setReportFormat(v as ReportFormat)}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                          {reportFormats.map(format => (
                            <SelectItem key={format} value={format}>{format}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating...</> : 'Generate Report'}
              </Button>
          </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Download className="h-5 w-5" /> Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>File</TableHead>
                            <TableHead>Rows</TableHead>
                            <TableHead>Generated</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {generatedReports.length > 0 ? generatedReports.map(rep => (
                            <TableRow key={rep.id}>
                                <TableCell className="font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground"/> {rep.fileName}</TableCell>
                                <TableCell>{rep.rowCount}</TableCell>
                                <TableCell>{rep.generatedAt.toLocaleTimeString()}</TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm">Download</Button></TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="text-center h-24">No reports generated yet.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5" /> Scheduled Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <p className="font-semibold">Coming Soon</p>
                    <p className="text-sm">Automated report scheduling will appear here.</p>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
