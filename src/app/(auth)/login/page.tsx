'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { LoginFormData, LoginSchema } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const form = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormData) => {
        login(data.email, data.password);
    };

    const mockUsers = [
        { role: 'Super Admin', email: 'admin@baalvion.com' },
        { role: 'Recruiter', email: 'recruiter@baalvion.com' },
        { role: 'Admin / Manager', email: 'manager@baalvion.com' },
        { role: 'Interviewer', email: 'elon@tesla.com' },
        { role: 'Finance', email: 'finance@acme.inc' },
        { role: 'Candidate', email: 'elena.rodriguez@example.com' },
    ];

    return (
        <div className="flex h-screen items-center justify-center bg-muted p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="admin@baalvion.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                             <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                    <FormDescription>Any password will work for mock users.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-start text-sm text-muted-foreground pt-4 border-t">
                    <h3 className="font-semibold mb-2 text-foreground">Quick Logins</h3>
                    <ul className="space-y-1 w-full">
                        {mockUsers.map(user => (
                            <li key={user.email} className="flex justify-between items-center">
                                <span className="font-medium">{user.role}:</span>
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-xs sm:text-sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        form.setValue('email', user.email);
                                    }}
                                >
                                    {user.email}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardFooter>
            </Card>
        </div>
    );
}
