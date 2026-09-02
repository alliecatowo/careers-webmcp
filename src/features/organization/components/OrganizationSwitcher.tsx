'use client';
import { useTenant } from "@/context/TenantContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { OrganizationAvatar } from "./OrganizationAvatar";
import { cn } from "@/lib/utils";

export function OrganizationSwitcher() {
  const { currentOrganization, organizations, switchOrganization } = useTenant();

  if (!currentOrganization) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full md:w-[250px] justify-between"
        >
          <div className="flex items-center gap-2">
            <OrganizationAvatar organization={currentOrganization} />
            <span className="truncate font-semibold">{currentOrganization.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]" align="start">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onSelect={() => switchOrganization(org.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
                <OrganizationAvatar organization={org} />
                <span className="truncate">{org.name}</span>
            </div>
            <Check className={cn(
                "h-4 w-4",
                currentOrganization.id === org.id ? "opacity-100" : "opacity-0"
            )} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
