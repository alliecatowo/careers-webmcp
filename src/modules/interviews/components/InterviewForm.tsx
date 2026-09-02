'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Loader2, CalendarIcon } from 'lucide-react';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { interviewService } from '@/services/interview.service';
import { Interview, interviewStatuses } from '../domain/interview.entity';
import { candidateService } from '@/services/candidate.service';
import useSWR from 'swr';
import { Candidate } from '@/modules/candidates/candidates.types';
import { talentService } from '@/services/talent.service';
import { Job } from '@/lib/talent-acquisition';
import { userService } from '@/services/user.service';
import { SystemUser } from '@/modules/users/domain/user.entity';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const interviewFormSchema = z.object({
  candidateId: z.string().min(1, 'Candidate is required.'),
  jobId: z.string().min(1, 'Job is required.'),
  stage: z.string().min(1, 'Interview stage is required.'),
  scheduledAt: z.date({ required_error: 'A date and time is required.' }),
  interviewerIds: z
    .array(z.string())
    .min(1, 'At least one interviewer is required.'),
});

type InterviewFormData = z.infer<typeof interviewFormSchema>;

interface InterviewFormProps {
  onSaveSuccess: () => void;
}

export function InterviewForm({ onSaveSuccess }: InterviewFormProps) {
  const { data: candidates, isLoading: isLoadingCandidates } = useSWR(
    'candidatesForForm',
    () => candidateService.getCandidates({ limit: 1000, page: 1 }),
  );
  const { data: jobs, isLoading: isLoadingJobs } = useSWR('jobsForForm', () =>
    talentService.getJobs({ status: 'published' }),
  );
  const { data: users, isLoading: isLoadingUsers } = useSWR(
    'usersForForm',
    userService.getUsers,
  );

  const form = useForm<InterviewFormData>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      interviewerIds: [],
    },
  });

  const { run: scheduleInterview, isLoading: isSubmitting } = useAsyncAction(
    async (values: InterviewFormData) => {
      const candidate = candidates?.data.find(
        (c) => c.id === values.candidateId,
      );
      const job = jobs?.data.find((j) => j.id === values.jobId);
      const interviewers = users?.filter((u) =>
        values.interviewerIds.includes(u.id),
      );

      if (!candidate || !job || !interviewers)
        throw new Error('Invalid data selected.');

      const payload = {
        applicationId: `app-${candidate.id}-${job.id}`, // Mock application ID
        candidateId: candidate.id,
        candidateName: candidate.name,
        jobTitle: job.title,
        stage: values.stage,
        scheduledAt: values.scheduledAt,
        interviewerIds: interviewers.map((i) => i.id),
        interviewerNames: interviewers.map((i) => i.name),
        meetingLink: `https://meet.baalvion.com/mock-${Date.now()}`,
      };
      await interviewService.schedule(
        values.candidateId, // This should be applicationId
        values.scheduledAt.toISOString(), // Convert date to string
      );
    },
    {
      onSuccess: () => {
        onSaveSuccess();
      },
    },
  );

  const isLoadingDropdowns =
    isLoadingCandidates || isLoadingJobs || isLoadingUsers;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(scheduleInterview)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="candidateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingDropdowns}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a candidate..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {candidates?.data.map((c: Candidate) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingDropdowns}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobs?.data.map((j: Job) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interview Stage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a stage..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TECHNICAL_ROUND">
                    Technical Round
                  </SelectItem>
                  <SelectItem value="HR_ROUND">HR Round</SelectItem>
                  <SelectItem value="FINAL_ROUND">Final Round</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP HH:mm')
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
                  {/* In real app, add time picker here */}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interviewerIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interviewer(s)</FormLabel>
              <Select
                onValueChange={(val) => field.onChange([val])}
                disabled={isLoadingDropdowns}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interviewer..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((u: SystemUser) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting || isLoadingDropdowns}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            'Schedule Interview'
          )}
        </Button>
      </form>
    </Form>
  );
}
