'use client';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UserRole } from '@/lib/access/access.types';
import { MultiSelect } from '@/components/ui/multi-select';
import { mockSkillOptions } from '../data';

interface SkillsTabProps {
    userRole: UserRole;
}

export function SkillsTab({ userRole }: SkillsTabProps) {
    const { control, setValue, watch } = useFormContext();
    const requiredSkills = watch('skills.required');
    const preferredSkills = watch('skills.preferred');

    return (
        <div className="space-y-8">
            <FormField
                control={control}
                name="skills.required"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                            <MultiSelect
                                options={mockSkillOptions.map(s => ({ value: s.id, label: s.name }))}
                                selected={requiredSkills?.map((s: any) => s.id) || []}
                                onChange={(selectedIds) => {
                                    const selectedSkills = mockSkillOptions.filter(opt => selectedIds.includes(opt.id));
                                    setValue('skills.required', selectedSkills);
                                }}
                                placeholder="Select required skills..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="skills.preferred"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Preferred Skills</FormLabel>
                        <FormControl>
                             <MultiSelect
                                options={mockSkillOptions.map(s => ({ value: s.id, label: s.name }))}
                                selected={preferredSkills?.map((s: any) => s.id) || []}
                                onChange={(selectedIds) => {
                                    const selectedSkills = mockSkillOptions.filter(opt => selectedIds.includes(opt.id));
                                    setValue('skills.preferred', selectedSkills);
                                }}
                                placeholder="Select preferred skills..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
