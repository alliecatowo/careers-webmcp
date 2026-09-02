
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
import { milestoneService } from '@/services/service';
import { useState } from 'react';
import { Milestone } from '@/types/contracts';

interface SubmitMilestoneDialogProps {
  milestone: Milestone;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitMilestoneDialog({ milestone, isOpen, onClose, onSuccess }: SubmitMilestoneDialogProps) {
  const { showToast } = useToast();
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');

  const { run: submit, isLoading } = useAsyncAction(milestoneService.submitMilestone, {
    onSuccess: () => {
      showToast({ type: 'success', title: "Milestone Submitted", description: 'No description provided' });
      onSuccess();
    },
    onError: (err) => showToast({type: 'error', title: "Submission Failed", description: err.message })
  });

  const handleSubmit = () => {
    submit(milestone.id, submissionUrl);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Milestone: {milestone.title}</DialogTitle>
          <DialogDescription>
            Provide the link to your work and any relevant notes for the client.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="submissionUrl">Submission URL (e.g., GitHub, Figma, Google Drive)</Label>
            <Input id="submissionUrl" value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="submissionNote">Notes for Client</Label>
            <Textarea id="submissionNote" value={submissionNote} onChange={(e) => setSubmissionNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !submissionUrl}>
            {isLoading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
