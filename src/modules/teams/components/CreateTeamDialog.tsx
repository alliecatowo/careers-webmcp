
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/system/Toast/useToast';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { teamService } from '@/services/service';
import { useState } from 'react';
import { Project } from '@/types/contracts';
import { useAuthStore } from '@/store/auth.store';

interface CreateTeamDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamDialog({ project, isOpen, onClose }: CreateTeamDialogProps) {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  const { run: create, isLoading } = useAsyncAction(teamService.createTeam, {
    onSuccess: () => {
      showToast({ type: 'success', title: "Team Created", description: `The team "${teamName}" has been successfully created.` });
      onClose();
    },
    onError: (err) => showToast({type: 'error', title: "Creation Failed", description: err.message })
  });

  const handleSubmit = () => {
    if (!teamName || !teamDescription) {
        showToast({ type: 'warning', title: "Please fill out all fields", description: 'A team name and description are required.' });
        return;
    }
     if (!user) {
        showToast({ type: 'error', title: "You must be logged in to create a team", description: 'Please log in to create a team.' });
        return;
    }

    create({
        projectId: project.id,
        name: teamName,
        description: teamDescription,
        leaderId: user.id,
        members: [{ userId: user.id, roleId: 'r1', joinedAt: new Date().toISOString() }], // Mock role
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Team for: {project.title}</DialogTitle>
          <DialogDescription>
            Assemble a team to tackle this project. You will be the team leader.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="teamDescription">Team Description</Label>
                <Textarea id="teamDescription" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} />
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !teamName || !teamDescription}>
            {isLoading ? 'Creating...' : 'Create Team'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
