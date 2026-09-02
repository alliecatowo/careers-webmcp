'use client';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { UserRole } from '@/lib/access/access.types';

interface ComplianceTabProps {
    userRole: UserRole;
}

export function ComplianceTab({ userRole }: ComplianceTabProps) {
    const { control, watch } = useFormContext();
    const country = watch('basicInfo.countryId');
    const isComplianceOfficer = userRole === 'SUPER_ADMIN'; // Simplified

    const isEU = country === 'country_gb'; // Mock logic

    return (
        <div className="space-y-8">
            <FormField control={control} name="compliance.workAuth" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel>Work Authorization Required</FormLabel>
                        <FormDescription>Does the candidate need to have pre-existing work authorization for this country?</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!isComplianceOfficer} /></FormControl>
                </FormItem>
            )} />

             <FormField control={control} name="compliance.visaSponsorship" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel>Visa Sponsorship Available</FormLabel>
                        <FormDescription>Can the company sponsor a work visa for this role?</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!isComplianceOfficer} /></FormControl>
                </FormItem>
            )} />

            <FormField control={control} name="compliance.relocation" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel>Relocation Support</FormLabel>
                        <FormDescription>Is relocation assistance provided for this role?</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!isComplianceOfficer} /></FormControl>
                </FormItem>
            )} />

            {isEU && (
                 <FormField control={control} name="compliance.gdprConsent" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="space-y-0.5">
                            <FormLabel>GDPR Consent</FormLabel>
                            <FormDescription>GDPR applies to this EU-based role. This field is mandatory.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!isComplianceOfficer} /></FormControl>
                    </FormItem>
                )} />
            )}

            <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold">Auto-Generated Compliance Text</h4>
                <p className="text-sm text-muted-foreground mt-2">
                    {country === 'country_us' ? 'Baalvion is an equal opportunity employer and complies with all applicable federal, state, and local fair employment practices laws.' : 'Baalvion is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.'}
                </p>
            </div>
        </div>
    );
}
