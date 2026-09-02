
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
import { useToast } from '@/components/system/Toast/useToast';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { reviewService } from '@/services/service';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

interface SubmitReviewDialogProps {
  projectId: string;
  revieweeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitReviewDialog({ projectId, revieweeId, isOpen, onClose, onSuccess }: SubmitReviewDialogProps) {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { run: submit, isLoading } = useAsyncAction(reviewService.submitReview, {
    onSuccess: () => {
      showToast({ type: 'success', title: "Review Submitted", description: "Your feedback has been successfully submitted." });
      onSuccess();
    },
    onError: (err) => showToast({type: 'error', title: "Submission Failed", description: err.message })
  });

  const handleSubmit = () => {
    if (rating === 0) {
        showToast({ type: 'warning', title: "Please select a rating", description: "You must provide a star rating." });
        return;
    }
    if (!user) {
        showToast({ type: 'error', title: "You must be logged in to leave a review.", description: "Please log in to submit your review." });
        return;
    }
    submit({ projectId, revieweeId, reviewerId: user.id, rating, comment });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            Your feedback helps maintain a trustworthy marketplace. Please rate your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRating(star)}>
                        <Star className={cn("h-8 w-8 text-gray-300", rating >= star && "text-yellow-400 fill-yellow-400")} />
                    </button>
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share details of your experience..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading || rating === 0}>
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
