'use client';
import Image from 'next/image';
import { TeamMember } from '@/lib/team.data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface TeamCardProps {
  member: TeamMember;
  onClick: () => void;
}

export function TeamCard({ member, onClick }: TeamCardProps) {
  const img = PlaceHolderImages.find((p) => p.id === member.image);
  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border"
      onClick={onClick}
    >
      <div className="aspect-[4/5] relative">
        {img && (
          <Image
            src={img.imageUrl}
            alt={`Photo of ${member.name}`}
            data-ai-hint={img.imageHint}
            width={320}
            height={320}
            className="h-full w-full object-cover object-top scale-100  transition-transform duration-700"
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{member.name}</CardTitle>

        <CardDescription>{member.role}</CardDescription>
        <CardDescription className="text-muted-foreground text-sm">
          {member.tagline}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
