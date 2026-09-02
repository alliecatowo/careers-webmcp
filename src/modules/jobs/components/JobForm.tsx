'use client';
import { useState } from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@/lib/talent-acquisition";
import { User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/system/Toast/useToast';
import { Loader2 } from 'lucide-react';
import { jobCreationSchema, JobCreationData, transformToApiPayload } from './creation/schema';
import { getInitialValues } from './creation/data';

import { BasicInfoTab } from './creation/tabs/BasicInfoTab';
import { RoleDetailsTab } from './creation/tabs/RoleDetailsTab';
import { SkillsTab } from './creation/tabs/SkillsTab';
import { CompensationTab } from './creation/tabs/CompensationTab';
import { ComplianceTab } from './creation/tabs/ComplianceTab';
import { VisibilityWorkflowTab } from './creation/tabs/VisibilityWorkflowTab';


interface JobFormProps {
    user: User;
    existingJob?: Job | null;
    onSaveSuccess?: () => void;
}

const TABS = [
  { value: "basic", label: "Basic Info" },
  { value: "details", label: "Role Details" },
  { value: "skills", label: "Skills" },
  { value: "compensation", label: "Compensation" },
  { value: "compliance", label: "Compliance" },
  { value: "workflow", label: "Workflow" },
];


export function JobForm({ user, existingJob, onSaveSuccess }: JobFormProps) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(TABS[0].value);
    const isEditMode = !!existingJob;

    const methods = useForm<JobCreationData>({
        resolver: zodResolver(jobCreationSchema),
        defaultValues: getInitialValues(existingJob),
    });

    const handleNextTab = async () => {
      const currentTabIndex = TABS.findIndex(t => t.value === activeTab);
      // Logic to validate current tab before proceeding can be added here
      if (currentTabIndex < TABS.length - 1) {
        setActiveTab(TABS[currentTabIndex + 1].value);
      }
    };
    
    async function onSubmit(values: JobCreationData) {
        setIsSubmitting(true);
        const apiPayload = transformToApiPayload(values);

        console.log("SUBMITTING FORM DATA:", values);
        console.log("TRANSFORMED API PAYLOAD:", apiPayload);
        
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSubmitting(false);
        showToast({
            type: 'success',
            title: isEditMode ? "Job Updated" : "Job Created",
            description: `The job "${values.basicInfo.title}" has been successfully saved.`
        });
        if(onSaveSuccess) onSaveSuccess();
    }
    
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
                        {TABS.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <TabsContent value="basic"><BasicInfoTab userRole={user.role} /></TabsContent>
                    <TabsContent value="details"><RoleDetailsTab userRole={user.role} /></TabsContent>
                    <TabsContent value="skills"><SkillsTab userRole={user.role} /></TabsContent>
                    <TabsContent value="compensation"><CompensationTab userRole={user.role} /></TabsContent>
                    <TabsContent value="compliance"><ComplianceTab userRole={user.role} /></TabsContent>
                    <TabsContent value="workflow"><VisibilityWorkflowTab userRole={user.role} /></TabsContent>

                </Tabs>
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                    <Button type="button" variant="outline" disabled={isSubmitting}>Save Draft</Button>
                    {activeTab !== TABS[TABS.length - 1].value ? (
                        <Button type="button" onClick={handleNextTab}>Save & Continue</Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditMode ? 'Update Job' : 'Submit for Approval'}
                        </Button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
}
