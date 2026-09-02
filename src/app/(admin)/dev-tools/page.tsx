'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/system/Toast/useToast';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { apiClient } from '@/lib/apiClient';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Loader2,
  Send,
  Mail,
  Briefcase,
  FileCheck2,
  BarChart2,
  CalendarPlus,
} from 'lucide-react';
import { analyticsService } from '@/modules/analytics/services/analytics.adapter';
import { subDays } from 'date-fns';
import { ApplicationsByCountryChart } from '@/modules/analytics/components/ApplicationsByCountryChart';
import { ApplicationsByDepartmentChart } from '@/modules/analytics/components/ApplicationsByDepartmentChart';
import { RecentlyViewedJobs } from '@/modules/jobs/components/RecentlyViewedJobs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { GoogleIndexingTrigger } from '@/components/admin/GoogleIndexingTrigger';
import { motion } from 'framer-motion';

// Schemas for the forms
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1, 'Subject is required.'),
  body: z.string().min(1, 'Body is required.'),
});
type EmailFormData = z.infer<typeof emailSchema>;

const calendarSchema = z.object({
  candidateName: z.string().min(1, 'Candidate name is required.'),
  jobTitle: z.string().min(1, 'Job title is required.'),
  scheduledAt: z.date({ required_error: 'A date is required.' }),
});
type CalendarFormData = z.infer<typeof calendarSchema>;

// Components for the dashboard
function EmailTester() {
  const { showToast } = useToast();
  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      to: 'test@example.com',
      subject: 'Test Email',
      body: 'This is a test.',
    },
  });
  const { data: emailLog, mutate: mutateEmailLog } = useSWR('/email-log', () =>
    apiClient.get('/email-log'),
  );
  const { run: sendEmail, isLoading } = useAsyncAction(
    (data: EmailFormData) => apiClient.post('/send-email', data),
    {
      onSuccess: () => {
        showToast({
          type: 'success',
          title: 'Email Sent (Mock)',
          description: 'Check the server console and log below.',
        });
        mutateEmailLog();
      },
      onError: (err) =>
        showToast({
          type: 'error',
          title: 'Failed to Send',
          description: err.message,
        }),
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail /> Email Notification Tester
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(sendEmail)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="recipient@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Application Status" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Email content..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h4 className="font-semibold text-sm pt-4 border-t">
              Mock Sent Email Log
            </h4>
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {!emailLog && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              <ul className="divide-y">
                {Array.isArray(emailLog?.data) &&
                  emailLog.data.map((email: any, index: number) => (
                    <li key={index} className="p-2 text-xs">
                      <span className="font-bold">{email.to}:</span>{' '}
                      {email.subject}
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2" />
              ) : (
                <Send className="mr-2" />
              )}
              Send Mock Email
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function CalendarTester() {
  const { showToast } = useToast();
  const { data: events, mutate } = useSWR('/scheduled-interviews', () =>
    apiClient.get('/scheduled-interviews'),
  );
  const form = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
  });
  const { run: schedule, isLoading } = useAsyncAction(
    async (data: CalendarFormData) =>
      apiClient.post('/schedule-interview', data),
    {
      onSuccess: () => {
        showToast({
          type: 'success',
          title: 'Interview Scheduled (Mock)',
          description: 'No description provided',
        });
        mutate();
        form.reset();
      },
      onError: (err) =>
        showToast({
          type: 'error',
          title: 'Scheduling Failed',
          description: err.message,
        }),
    },
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon /> Calendar Integration Tester
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(schedule)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="candidateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Jane Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Software Engineer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Interview Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h4 className="font-semibold text-sm pt-4 border-t">
              Live Scheduled Interviews
            </h4>
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {!events && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin" />
                </div>
              )}
              <ul className="divide-y">
                {Array.isArray(events?.data) &&
                  events.data.map((event: any) => (
                    <li key={event.id} className="p-2 text-xs">
                      <p className="font-medium">
                        {event.candidateName} - {event.jobTitle}
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(event.scheduledAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2" />
              ) : (
                <CalendarPlus className="mr-2" />
              )}
              Schedule Interview
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function AnalyticsCard() {
  const { data, isLoading } = useSWR('dev-dashboard-analytics', () =>
    analyticsService.getDashboardData({
      dateRange: { from: subDays(new Date(), 365), to: new Date() },
    }),
  );
  if (isLoading || !data) return null;
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 /> Analytics Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        {data.departmentHiring && (
          <ApplicationsByDepartmentChart data={data.departmentHiring} />
        )}
        {data.collegeWiseStats && (
          <ApplicationsByCountryChart
            data={data.collegeWiseStats.map((item) => ({
              country: item.college,
              applications: item.placements,
            }))}
          />
        )}
      </CardContent>
    </Card>
  );
}

function TaskStatusCard() {
  const tasksContent = `- **Task**: Implement Subtle Page Transitions - **Status**: \`Completed\`
- **Task**: Add Loading Skeletons to Public Pages - **Status**: \`Completed\`
- **Task**: Implement Real Email Notifications - **Status**: \`Completed\`
- **Task**: Real-time Admin Notifications for New Applications - **Status**: \`Completed\`
- **Task**: Add Granular Application Trend Charts - **Status**: \`Completed\`
- **Task**: Implement Calendar Integration for Interview Scheduling - **Status**: \`Completed\`
- **Task**: Implement Advanced Image Optimization - **Status**: \`Completed\`
- **Task**: Enhance Audit Trail for Sensitive Data Access - **Status**: \`Completed\`
- **Task**: Implement "Recently Viewed Jobs" - **Status**: \`Completed\``;
  const tasks = tasksContent
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .map((line) => {
      const match = line.match(/\*\*(.*?)\*\* - \*\*Status\*\*: \`(.*?)\`/);
      return match ? { name: match[1], status: match[2] } : null;
    })
    .filter(Boolean);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck2 /> Enhancement Tasks Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{task!.name}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={
                      task!.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : ''
                    }
                  >
                    {task!.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RecentlyViewedJobsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase /> Recently Viewed Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RecentlyViewedJobs />
      </CardContent>
    </Card>
  );
}

export default function DevDashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Developer Dashboard
        </h1>
        <p className="text-muted-foreground">
          A consolidated view for testing mock integrations and platform
          features.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <EmailTester />
          <TaskStatusCard />
        </div>
        <div className="space-y-8">
          <CalendarTester />
          <RecentlyViewedJobsCard />
        </div>
      </div>
      <GoogleIndexingTrigger />
      <AnalyticsCard />
    </motion.div>
  );
}
