'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { candidateService } from "@/services/candidate.service";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { Candidate } from "../candidates.types";

const candidateFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  jobTitle: z.string().min(3, "Job title is required."),
});

type CandidateFormData = z.infer<typeof candidateFormSchema>;

interface CandidateFormProps {
    existingCandidate?: Candidate | null;
    onSaveSuccess: () => void;
}

export function CandidateForm({ existingCandidate, onSaveSuccess }: CandidateFormProps) {
    const isEditMode = !!existingCandidate;

    const form = useForm<CandidateFormData>({
        resolver: zodResolver(candidateFormSchema),
        defaultValues: existingCandidate ? {
            name: existingCandidate.name,
            email: existingCandidate.email,
            phone: existingCandidate.phone,
            jobTitle: existingCandidate.jobTitle,
        } : {
            name: "",
            email: "",
            phone: "",
            jobTitle: "",
        },
    });

    const { run: saveCandidate, isLoading: isSubmitting } = useAsyncAction(
      async (values: CandidateFormData) => {
        const payload = {
            ...values,
            // Default values for fields not in the form
            experienceYears: existingCandidate?.experienceYears || 0,
            stage: existingCandidate?.stage || 'APPLIED',
            rating: existingCandidate?.rating || 0,
        };

        if (isEditMode) {
        //   await candidateService.update(existingCandidate.id, payload);
        } else {
          await candidateService.create(payload as any);
        }
      },
      {
        onSuccess: () => {
          onSaveSuccess();
        },
      }
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(saveCandidate)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="e.g. user@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="e.g. 555-123-4567" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="jobTitle" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Applying for Job Title</FormLabel>
                        <FormControl><Input placeholder="e.g. Frontend Engineer" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                     {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (isEditMode ? "Save Changes" : "Create Candidate")}
                </Button>
            </form>
        </Form>
    );
}
