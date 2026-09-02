'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/system/Toast/useToast";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
    user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
        },
    });

    async function onSubmit(values: ProfileFormData) {
        setIsSubmitting(true);
        // MOCK API CALL
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Updated profile data:", values);
        setIsSubmitting(false);
        showToast({
            type: 'success',
            title: "Profile Updated",
            description: "Your information has been saved successfully.",
        });
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="your@email.com" {...field} readOnly disabled />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </form>
            </Form>

            <Card>
                <CardHeader>
                    <CardTitle>Your Resume</CardTitle>
                    <CardDescription>This is the resume that will be shared with recruiters. You can upload a new one to replace it.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg flex items-center justify-between bg-muted/50">
                        <p className="text-sm font-medium">Current_Resume_Jane_Doe.pdf</p>
                        <Button variant="outline" size="sm" disabled>Download</Button>
                    </div>
                     <Button variant="secondary" disabled>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New Resume
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
}
