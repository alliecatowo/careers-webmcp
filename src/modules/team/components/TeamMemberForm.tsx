'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { TeamMember } from "@/lib/team.data";
// import { teamService } from "@/services/team.service";

const teamMemberFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  role: z.string().min(2, "Role is required."),
  tagline: z.string().min(5, "Tagline is required."),
  bio: z.string().min(20, "Bio must be at least 20 characters."),
  expertise: z.array(z.string()).min(1, "At least one expertise is required."),
  linkedin: z.string().url("Must be a valid LinkedIn URL."),
  portfolio: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  image: z.any().optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;

interface TeamMemberFormProps {
    existingMember?: TeamMember | null;
    onSaveSuccess: () => void;
}

export function TeamMemberForm({ existingMember, onSaveSuccess }: TeamMemberFormProps) {
    const isEditMode = !!existingMember;

    const form = useForm<TeamMemberFormData>({
        resolver: zodResolver(teamMemberFormSchema),
        defaultValues: existingMember ? {
            name: existingMember.name,
            role: existingMember.role,
            tagline: existingMember.tagline,
            bio: existingMember.bio,
            expertise: existingMember.expertise,
            linkedin: existingMember.socials.linkedin,
            portfolio: existingMember.socials.portfolio,
            image: undefined,
        } : {
            name: "",
            role: "",
            tagline: "",
            bio: "",
            expertise: [],
            linkedin: "https://linkedin.com/in/",
            portfolio: "",
            image: undefined,
        },
    });

    const { fields: expertiseFields, append: appendExpertise, remove: removeExpertise } = useFieldArray({
        control: form.control,
        name: "expertise",
    });

    const { run: saveMember, isLoading: isSubmitting } = useAsyncAction(
      async (values: TeamMemberFormData) => {
        const payload: Omit<TeamMember, 'id'> = {
          name: values.name,
          role: values.role,
          tagline: values.tagline,
          bio: values.bio,
          expertise: values.expertise,
          socials: {
            linkedin: values.linkedin,
            portfolio: values.portfolio,
          },
          image: existingMember?.image || `https://picsum.photos/seed/${Date.now()}/400/500`,
          imageHint: existingMember?.imageHint || 'person portrait',
        };
        
        // If a new image is uploaded, generate a new placeholder.
        if (values.image) {
            payload.image = `https://picsum.photos/seed/${values.image.name}/400/500`;
        }

        // if (isEditMode) {
        //   await teamService.updateTeamMember(existingMember.id, payload);
        // } else {
        //   await teamService.createTeamMember(payload);
        // }
      },
      {
        onSuccess: onSaveSuccess,
      }
    );

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(saveMember)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role / Position</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>

                <FormField control={form.control} name="tagline" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Biography</FormLabel>
                        <FormControl><Textarea {...field} className="min-h-[120px]" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <FormItem>
                    <FormLabel>Expertise</FormLabel>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                        {expertiseFields.map((field, index) => (
                             <div key={field.id} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm">
                                {form.getValues(`expertise.${index}`)}
                                <button type="button" onClick={() => removeExpertise(index)}><Trash2 className="h-3 w-3 text-destructive" /></button>
                            </div>
                        ))}
                    </div>
                    <FormControl>
                        <Input placeholder="Type a skill and press Enter to add..." onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value) {
                                e.preventDefault();
                                appendExpertise(e.currentTarget.value);
                                e.currentTarget.value = "";
                            }
                        }} />
                    </FormControl>
                    <FormMessage />
                </FormItem>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="linkedin" render={({ field }) => (
                        <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="portfolio" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Portfolio/GitHub URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                
                 <FormField control={form.control} name="image" render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={e => onChange(e.target.files?.[0])} {...rest} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                     {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (isEditMode ? "Save Changes" : "Add Team Member")}
                </Button>
            </form>
        </Form>
    );
}
