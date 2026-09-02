'use client';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/access/access.types';
import { jobStatuses } from '@/types/workflow.types';
import { mockApprovalRoles, mockHiringManagers } from '../data';
import { MultiSelect } from '@/components/ui/multi-select';

interface VisibilityWorkflowTabProps {
    userRole: UserRole;
}

export function VisibilityWorkflowTab({ userRole }: VisibilityWorkflowTabProps) {
    const { control, setValue, watch } = useFormContext();
    const isRecruiter = userRole === 'RECRUITER';
    const isAdmin = userRole === 'SUPER_ADMIN';

    const approvalChain = watch('workflow.approvalChain');

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={control} name="workflow.status" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Publish Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {jobStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {!isAdmin && <FormDescription>Only Admins can change publish status.</FormDescription>}
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={control} name="workflow.priority" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={control} name="workflow.publishDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Publish Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={control} name="workflow.expiryDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Expiration Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            
            <div className="space-y-4">
                 <FormField control={control} name="workflow.isFeatured" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel>Featured Job</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
                 <FormField control={control} name="workflow.isInternalOnly" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <FormLabel>Internal Only</FormLabel>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
            </div>

            <FormField control={control} name="workflow.hiringManagerId" render={({ field }) => (
                <FormItem>
                    <FormLabel>Assigned Hiring Manager</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a manager" /></SelectTrigger></FormControl>
                        <SelectContent>
                            {mockHiringManagers.map(mgr => <SelectItem key={mgr.value} value={mgr.value}>{mgr.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )} />

             <FormField control={control} name="workflow.approvalChain" render={({ field }) => (
                <FormItem>
                    <FormLabel>Approval Chain</FormLabel>
                    <FormControl>
                        <MultiSelect
                            options={mockApprovalRoles}
                            selected={approvalChain || []}
                            onChange={(selected) => setValue('workflow.approvalChain', selected)}
                            placeholder="Select roles for approval..."
                            disabled={isRecruiter}
                        />
                    </FormControl>
                     {isRecruiter && <FormDescription>Only Admins can edit the approval chain.</FormDescription>}
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
}
