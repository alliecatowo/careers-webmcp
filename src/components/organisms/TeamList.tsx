import { Team } from '@/types/contracts';
import { TeamCard } from '@/components/molecules/TeamCard';

interface TeamListProps {
  teams: Team[];
}

export function TeamList({ teams }: TeamListProps) {
  if (teams.length === 0) {
    return <p className="text-center text-muted-foreground p-8">No teams have been formed for this project yet.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {teams.map(team => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
