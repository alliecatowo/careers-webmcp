
'use client';
import { useState } from 'react';
import { Milestone, MilestoneStatus, UserRole } from '@/types/contracts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, FileUp, MoreVertical, DollarSign } from 'lucide-react';
import { milestoneService } from '@/services/service';
import { useToast } from '@/components/system/Toast/useToast';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { SubmitMilestoneDialog } from './SubmitMilestoneDialog';
import { formatCurrency } from '@/lib/utils/currency';

interface MilestoneListProps {
    milestones: Milestone[];
    role: UserRole;
    onUpdate: () => void;
}

const statusStyles: Record<MilestoneStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  ACTIVE: "bg-blue-100 text-blue-800",
  SUBMITTED: "bg-yellow-100 text-yellow-800",
  UNDER_REVIEW: "bg-purple-100 text-purple-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  PAID: "bg-teal-100 text-teal-800",
};

const statusIcons: Record<MilestoneStatus, React.ReactNode> = {
    DRAFT: <Clock className="h-4 w-4" />,
    ACTIVE: <Clock className="h-4 w-4" />,
    SUBMITTED: <Clock className="h-4 w-4 animate-pulse" />,
    UNDER_REVIEW: <Clock className="h-4 w-4" />,
    APPROVED: <Check className="h-4 w-4" />,
    REJECTED: <Check className="h-4 w-4" />,
    PAID: <DollarSign className="h-4 w-4" />,
}

function MilestoneCard({ milestone, role, onUpdate }: { milestone: Milestone, role: UserRole, onUpdate: () => void }) {
    const { showToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { run: approve, isLoading: isApproving } = useAsyncAction(milestoneService.approveMilestone, { onSuccess: () => { onUpdate(); showToast({type: 'success', title: 'Milestone Approved', description: 'The milestone has been marked as approved.'}) } });
    const { run: reject, isLoading: isRejecting } = useAsyncAction(milestoneService.rejectMilestone, { onSuccess: () => { onUpdate(); showToast({type: 'success', title: 'Milestone Rejected', description: 'The milestone has been marked as rejected.'}) } });
    
    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

    return (
        <>
        <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                        {statusIcons[milestone.status]}
                        <h4 className="font-semibold">{milestone.title}</h4>
                        <Badge variant="outline" className={statusStyles[milestone.status]}>{milestone.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    <p className="text-xs text-muted-foreground">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                    <p className="font-bold text-lg">{formatCurrency(milestone.amount, 'USD')}</p>
                    {role === 'CLIENT' && (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" disabled>Fund Escrow</Button>
                            {milestone.status === 'SUBMITTED' && (
                                <>
                                    <Button size="sm" variant="destructive" onClick={() => reject(milestone.id)} disabled={isRejecting}>Reject</Button>
                                    <Button size="sm" onClick={() => approve(milestone.id)} disabled={isApproving}>Approve</Button>
                                </>
                            )}
                        </div>
                    )}
                    {role === 'CONTRACTOR' && milestone.status === 'ACTIVE' && (
                        <Button size="sm" onClick={() => setIsSubmitDialogOpen(true)}>
                           <FileUp className="mr-2 h-4 w-4" /> Submit Work
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
        {isSubmitDialogOpen && (
            <SubmitMilestoneDialog 
                milestone={milestone}
                isOpen={isSubmitDialogOpen}
                onClose={() => setIsSubmitDialogOpen(false)}
                onSuccess={() => { onUpdate(); setIsSubmitDialogOpen(false); }}
            />
        )}
        </>
    )
}


export function MilestoneList({ milestones, role, onUpdate }: MilestoneListProps) {
    if (!milestones.length) return <p>No milestones for this project yet.</p>;

    return (
        <div className="space-y-4">
            {milestones.map(m => <MilestoneCard key={m.id} milestone={m} role={role} onUpdate={onUpdate} />)}
        </div>
    );
}
