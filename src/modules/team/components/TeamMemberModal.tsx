'use client';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TeamMember } from '@/lib/team.data';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Globe } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamMemberModal({
  member,
  isOpen,
  onClose,
}: TeamMemberModalProps) {
  if (!member) return null;
  const img = PlaceHolderImages.find((p) => p.id === member.image);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-11/12 p-0 min-h-[400x] bg-card border text-foreground rounded-lg">
        <div className="grid md:grid-cols-2">
          <div className="relative h-auto aspect-square">
            {img && (
              <Image
                src={img.imageUrl}
                alt={`Portrait of ${member.name}`}
                width={200}
                height={200}
                className="object-cover object-top h-full w-full  md:rounded-l-lg md:rounded-t-none rounded-t-lg"
                data-ai-hint={img.imageHint}
                priority
              />
            )}
          </div>
          <div className="p-8 flex flex-col space-y-6">
            <div className="">
              <h2 className="text-3xl font-bold">{member.name}</h2>
              <p className="text-primary uppercase tracking-wider font-semibold">
                {member.role}
              </p>
              <p className="text-muted-foreground mt-1">{member?.tagline}</p>
            </div>
            <Separator />
            <p className="text-muted-foreground flex-grow">{member.bio}</p>
            {/* <div>
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
              </div>
            </div> */}
            {/* <div className="flex items-center gap-4 pt-4 border-t">
              <Link href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${member.name}'s LinkedIn Profile`}>
                <Linkedin />
              </Link>
              {member.socials.portfolio && (
                <Link href={member.socials.portfolio} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label={`${member.name}'s Portfolio`}>
                  <Globe />
                </Link>
              )}
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
