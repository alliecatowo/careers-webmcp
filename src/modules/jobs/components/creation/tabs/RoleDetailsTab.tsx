'use client';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/lib/access/access.types';
import { experienceBands } from '@/types/workflow.types';
import { Trash2, PlusCircle } from 'lucide-react';

interface RoleDetailsTabProps {
    userRole: UserRole;
}

export function RoleDetailsTab({ userRole }: RoleDetailsTabProps) {
    const { control } = useFormContext();

    const { fields: respFields, append: appendResp, remove: removeResp } = useFieldArray({ control, name: "roleDetails.responsibilities" });
    const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({ control, name: "roleDetails.requiredQualifications" });
    const { fields: prefQualFields, append: appendPrefQual, remove: removePrefQual } = useFieldArray({ control, name: "roleDetails.preferredQualifications" });

    return (
        <div className="space-y-6">
            <FormField control={control} name="roleDetails.description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Full Job Description</FormLabel>
                    <FormControl><Textarea {...field} className="min-h-[150px]" /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />

            <div className="space-y-2">
                <FormLabel>Responsibilities</FormLabel>
                {respFields.map((field, index) => (
                    <FormField key={field.id} control={control} name={`roleDetails.responsibilities.${index}.value`} render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl><Input {...field} /></FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeResp(index)} disabled={respFields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </FormItem>
                    )} />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendResp({ value: "" })}><PlusCircle className="mr-2 h-4 w-4"/>Add Responsibility</Button>
            </div>
            
            <div className="space-y-2">
                <FormLabel>Required Qualifications</FormLabel>
                {qualFields.map((field, index) => (
                    <FormField key={field.id} control={control} name={`roleDetails.requiredQualifications.${index}.value`} render={({ field }) => (
                         <FormItem>
                            <div className="flex items-center gap-2">
                                <FormControl><Input {...field} /></FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeQual(index)} disabled={qualFields.length <= 1}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </FormItem>
                    )} />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendQual({ value: "" })}><PlusCircle className="mr-2 h-4 w-4"/>Add Qualification</Button>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={control} name="roleDetails.experienceBand" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                {experienceBands.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={control} name="roleDetails.education" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Education Requirement</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. Bachelor's in Computer Science" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>
    );
}
