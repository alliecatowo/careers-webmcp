'use client';

import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/contracts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users } from 'lucide-react';

const roles: UserRole[] = ["CLIENT", "CONTRACTOR", "ADMIN"];

export function RoleSwitcher() {
  const { role, setRole } = useAuth();

  if (!role) return null;

  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue placeholder="Switch Role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map(r => (
            <SelectItem key={r} value={r}>{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
