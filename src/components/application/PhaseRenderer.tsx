
'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormFieldConfig, FormPhase } from '@/config/application-form-config';
import { Country } from '@/lib/talent-acquisition';
import { Slider } from '@/components/ui/slider';
import { MultiSelect } from '../ui/multi-select';

function renderField(fieldConfig: FormFieldConfig, country: Country) {
    const { control, setValue, watch } = useFormContext();

    if (fieldConfig.displayRule && !fieldConfig.displayRule(country)) {
        return null;
    }

    const renderStandardField = (field: any) => {
        switch (fieldConfig.type) {
            case 'select':
                return (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder={fieldConfig.placeholder} /></SelectTrigger>
                        <SelectContent>
                            {fieldConfig.options?.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                );
            case 'textarea':
                return <Textarea placeholder={fieldConfig.placeholder} {...field} />;
            case 'checkbox':
                return (
                    <div className="flex items-start space-x-3 rounded-md border p-4">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        <div className="space-y-1 leading-none"><FormLabel className="text-sm">{fieldConfig.description}</FormLabel></div>
                    </div>
                );
            case 'file':
                return <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />;
            case 'slider':
                return (
                    <div className="flex items-center gap-4">
                        <Slider defaultValue={[field.value || 0]} max={100} step={1} onValueChange={(value) => field.onChange(value[0])} />
                        <Input type="number" className="w-20" placeholder={fieldConfig.placeholder} {...field} value={field.value || 0} />
                    </div>
                );
             case 'checkbox-group':
                return (
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        render={({ field: controllerField }) => {
                            const fieldValue = watch(fieldConfig.name);
                            return (
                                <div className="p-4 border rounded-md space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                                        {fieldConfig.options?.map(option => (
                                            <FormItem key={option.value} className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={fieldValue?.includes(option.value)}
                                                        onCheckedChange={checked => {
                                                            const currentValue = fieldValue || [];
                                                            const newValue = checked
                                                                ? [...currentValue, option.value]
                                                                : currentValue.filter((v: string) => v !== option.value);
                                                            setValue(fieldConfig.name, newValue, { shouldValidate: true });
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </div>
                                    {fieldConfig.otherFieldName && (
                                         <FormField
                                            control={control}
                                            name={fieldConfig.otherFieldName}
                                            render={({ field: otherField }) => (
                                                <Input placeholder="Other (please specify)" {...otherField} />
                                            )}
                                        />
                                    )}
                                </div>
                            )
                        }}
                    />
                );
            default:
                return <Input placeholder={fieldConfig.placeholder} {...field} type={fieldConfig.type} />;
        }
    };

    return (
        <FormField
            key={fieldConfig.name}
            control={control}
            name={fieldConfig.name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{fieldConfig.label}</FormLabel>
                    <FormControl>{renderStandardField(field)}</FormControl>
                    {fieldConfig.type !== 'checkbox' && fieldConfig.description && <FormDescription>{fieldConfig.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

interface PhaseRendererProps {
    phase: FormPhase;
    country: Country;
}

export function PhaseRenderer({ phase, country }: PhaseRendererProps) {
  return (
    <div className="space-y-6">
      {phase.fields.map(fieldConfig => renderField(fieldConfig, country))}
    </div>
  );
}
