import { Team } from '@/types/contracts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle>{team.name}</CardTitle>
            <Badge variant="outline">{team.status}</Badge>
        </div>
        <CardDescription>Led by user: {team.leaderId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{team.description}</p>
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2" />
          <span>{team.members.length} members</span>
        </div>
      </CardContent>
    </Card>
  );
}
