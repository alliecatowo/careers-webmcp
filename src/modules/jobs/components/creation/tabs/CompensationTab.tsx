'use client';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserRole } from '@/lib/access/access.types';

interface CompensationTabProps {
    userRole: UserRole;
}

export function CompensationTab({ userRole }: CompensationTabProps) {
    const { control } = useFormContext();
    const isHm = userRole === 'RECRUITER'; // Simplified example

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={control} name="compensation.currency" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isHm}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="compensation.frequency" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pay Frequency</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isHm}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Annual">Annual</SelectItem>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Hourly">Hourly</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={control} name="compensation.minSalary" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Min Salary</FormLabel>
                        <FormControl><Input type="number" {...field} disabled={isHm} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={control} name="compensation.maxSalary" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Salary</FormLabel>
                        <FormControl><Input type="number" {...field} disabled={isHm} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>

            <FormField control={control} name="compensation.bonus" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bonus Structure</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. Up to 15% annually" disabled={isHm} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={control} name="compensation.equity" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel>Equity Option</FormLabel>
                            <FormDescription>Is this role eligible for equity?</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isHm} /></FormControl>
                    </FormItem>
                )} />
                 <FormField control={control} name="compensation.visibility" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Salary Visibility</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isHm}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="Range Only">Range Only</SelectItem>
                                <SelectItem value="Hidden">Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>
    );
}
