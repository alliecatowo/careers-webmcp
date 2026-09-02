'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TeamMember } from '@/lib/team.data';
import { TeamCard } from './TeamCard';
import { Skeleton } from '@/components/ui/skeleton';

const TeamMemberModal = dynamic(
  () => import('./TeamMemberModal').then((mod) => mod.TeamMemberModal),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <Skeleton className="w-full max-w-4xl h-96" />
      </div>
    ),
  },
);

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleOpenModal = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <TeamCard
            key={member.id || member.name}
            member={member}
            onClick={() => handleOpenModal(member)}
          />
        ))}
      </div>
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={handleCloseModal}
      />
    </>
  );
}
