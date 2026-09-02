
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { rolePermissionMatrix } from '@/lib/access/permission-matrix';
import { MOCK_ROLES } from '@/config/roles';
import { CheckCircle2 } from "lucide-react";

export default function RolesPage() {
    const roles = Object.entries(MOCK_ROLES);

    return (
        <div className="flex flex-col gap-8">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                 <p className="text-muted-foreground">Review the permissions assigned to each system role.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">
                {roles.map(([role, { description }]) => {
                    const permissions = rolePermissionMatrix[role as keyof typeof rolePermissionMatrix] || [];
                    const isSuperAdmin = permissions.includes('*');
                    const displayPermissions = isSuperAdmin ? ['All Permissions Granted'] : permissions.map(p => p.split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

                    return (
                        <Card key={role}>
                            <CardHeader>
                                <CardTitle>{role.replace('_', ' ')}</CardTitle>
                                <CardDescription>{description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h4 className="font-semibold mb-3 text-sm">Permissions:</h4>
                                <ul className="space-y-2">
                                    {displayPermissions.map(permission => (
                                         <li key={permission} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>{permission}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
