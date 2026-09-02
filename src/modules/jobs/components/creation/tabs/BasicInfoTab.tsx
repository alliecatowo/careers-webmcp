'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { UserRole } from '@/lib/access/access.types';
import { employmentTypes, workforceTypes } from '@/types/workflow.types';
import { mockDepartments } from '../data';
import { generateSlug } from '@/utils/slug.util';

interface BasicInfoTabProps {
    userRole: UserRole;
}

export function BasicInfoTab({ userRole }: BasicInfoTabProps) {
    const { control, setValue, watch } = useFormContext();
    const title = watch('basicInfo.title');

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={control} name="basicInfo.title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl><Input {...field} onBlur={(e) => {
                            field.onBlur();
                            setValue('basicInfo.slug', generateSlug(e.target.value));
                        }} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="basicInfo.slug" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={control} name="basicInfo.departmentId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {mockDepartments.map(dept => <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={control} name="basicInfo.internalCode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Internal Job Code</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={control} name="basicInfo.employmentType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {employmentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={control} name="basicInfo.workforceType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Workplace Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {workforceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={control} name="basicInfo.countryId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                               <SelectItem value="country_in">India</SelectItem>
                               <SelectItem value="country_us">United States</SelectItem>
                               <SelectItem value="country_gb">United Kingdom</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <FormField control={control} name="basicInfo.summary" render={({ field }) => (
                <FormItem>
                    <FormLabel>Short Summary</FormLabel>
                    <FormControl><Textarea {...field} maxLength={200} /></FormControl>
                    <FormDescription>A brief, 200-character summary for job cards.</FormDescription>
                    <FormMessage />
                </FormItem>
            )} />
        </div>
    );
}
