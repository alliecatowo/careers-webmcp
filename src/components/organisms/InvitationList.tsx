
'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Invitation } from '@/types/contracts';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { invitationService } from '@/services/service';
import { useToast } from '@/components/system/Toast/useToast';
import { mockProjects, mockTeams } from '@/services/mockData';
import { Check, X } from 'lucide-react';

interface InvitationCardProps {
    invitation: Invitation;
    onRespond: () => void;
}

function InvitationCard({ invitation, onRespond }: InvitationCardProps) {
    const { showToast } = useToast();
    const { run: respond, isLoading } = useAsyncAction(invitationService.respond, {
        onSuccess: (res) => {
            showToast({ type: 'success', title: `Invitation ${res?.data?.status}`, description: 'No description provided'});
            onRespond();
        }
    });

    const project = mockProjects.find(p => p.id === invitation.projectId);
    const team = mockTeams.find(t => t.id === invitation.teamId);

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
                <p className="font-semibold text-sm">{team?.name || 'A team'} invites you to join:</p>
                <p className="text-sm text-muted-foreground">{project?.title || 'a project'}</p>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => respond(invitation.id, 'Declined')} disabled={isLoading}><X className="h-4 w-4"/></Button>
                <Button size="sm" onClick={() => respond(invitation.id, 'Accepted')} disabled={isLoading}><Check className="h-4 w-4"/></Button>
            </div>
        </div>
    )
}

export function InvitationList({ invitations, onUpdate }: { invitations: Invitation[], onUpdate: () => void }) {
    if (!invitations || invitations.length === 0) {
        return null;
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {invitations.map(inv => (
                    <InvitationCard key={inv.id} invitation={inv} onRespond={onUpdate} />
                ))}
            </CardContent>
        </Card>
    );
}
