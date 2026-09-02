
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Organization } from "../types";

interface OrganizationAvatarProps {
  organization: Organization;
}

export function OrganizationAvatar({ organization }: OrganizationAvatarProps) {
  return (
    <Avatar className="h-6 w-6">
      {organization.logoUrl ? (
        <AvatarImage src={organization.logoUrl} alt={organization.name} />
      ) : (
        <AvatarFallback className="text-xs font-bold">
          {organization.name.charAt(0)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
