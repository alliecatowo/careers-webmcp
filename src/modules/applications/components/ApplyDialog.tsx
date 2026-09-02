
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/system/Toast/useToast';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { applicationService } from '@/services/service';
import { useState } from 'react';
import { Project, Role } from '@/types/contracts';
import { useAuthStore } from '@/store/auth.store';

interface ApplyDialogProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyDialog({ project, isOpen, onClose }: ApplyDialogProps) {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [proposal, setProposal] = useState('');

  const { run: submit, isLoading } = useAsyncAction(applicationService.submitApplication, {
    onSuccess: () => {
      showToast({ type: 'success', title: "Application Submitted", description: 'Your application has been successfully submitted.' });
      onClose();
    },
    onError: (err) => showToast({type: 'error', title: "Submission Failed", description: err.message })
  });

  const handleSubmit = () => {
    if (!selectedRole) {
        showToast({ type: 'warning', title: "Please select a role", description: 'You must select a role to apply for.' });
        return;
    }
    if (!proposal) {
        showToast({ type: 'warning', title: "Please write a proposal", description: 'A proposal is required to submit your application.' });
        return;
    }
     if (!user) {
        showToast({ type: 'error', title: "You must be logged in to apply", description: 'Please log in or create an account to apply.' });
        return;
    }

    submit({
        projectId: project.id,
        contractorId: user.id,
        roleId: selectedRole.id,
        proposalText: proposal,
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for: {project.title}</DialogTitle>
          <DialogDescription>
            Select a role and write a brief proposal explaining why you're a good fit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="role">Select a Role</Label>
                 <Select onValueChange={(roleId) => setSelectedRole(project.roles.find(r => r.id === roleId) || null)}>
                    <SelectTrigger><SelectValue placeholder="Choose a role..." /></SelectTrigger>
                    <SelectContent>
                        {project.roles.filter(r => r.filledCount < r.capacity).map(role => (
                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="proposal">Your Proposal</Label>
                <Textarea id="proposal" value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Explain your approach, relevant experience, and why you are the best candidate for this role..." />
            </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedRole || !proposal}>
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
