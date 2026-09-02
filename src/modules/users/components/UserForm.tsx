
'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { SystemUser } from '../domain/user.entity';
import { ALL_ADMIN_ROLES, UserRole, userRoles } from "@/lib/access/access.types";
import { userService } from "@/services/user.service";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useFieldPermission } from '@/hooks/usePermission';

const userFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    role: z.enum(userRoles, {
        required_error: "You need to select a user role.",
    }),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
    existingUser?: SystemUser | null;
    onSaveSuccess: () => void;
}

export function UserForm({ existingUser, onSaveSuccess }: UserFormProps) {
    const isEditMode = !!existingUser;
    const roleAccess = useFieldPermission('user', 'role', existingUser);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: existingUser ? {
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
        } : {
            name: "",
            email: "",
            role: "RECRUITER", // Default role for new users
        },
    });

    const { run: saveUser, isLoading: isSubmitting } = useAsyncAction(
        async (values: UserFormData) => {
            if (isEditMode) {
                await userService.update(existingUser.id, values);
            } else {
                await userService.create(values);
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
            <form onSubmit={form.handleSubmit(saveUser)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="e.g. Jane Doe" {...field} /></FormControl>
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
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={roleAccess !== 'write'}
                        >
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {ALL_ADMIN_ROLES.map(role => (
                                    <SelectItem key={role} value={role}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {roleAccess === 'read' && <FormDescription>You do not have permission to change this user's role.</FormDescription>}
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (isEditMode ? "Save Changes" : "Create User")}
                </Button>
            </form>
        </Form>
    );
}
