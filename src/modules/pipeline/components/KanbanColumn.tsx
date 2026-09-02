
'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ApplicationWithCandidate, ApplicationStatus } from '@/types';
import { KanbanCard } from './KanbanCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
    id: ApplicationStatus;
    title: string;
    applications: ApplicationWithCandidate[];
}

export function KanbanColumn({ id, title, applications }: KanbanColumnProps) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div className="w-72 flex-shrink-0">
            <div className="bg-muted rounded-t-lg p-3 flex items-center justify-between">
                <h3 className="font-semibold text-sm">{title}</h3>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{applications.length}</span>
            </div>
            <ScrollArea 
                ref={setNodeRef} 
                className="bg-muted/50 rounded-b-lg p-2 h-[calc(100vh-250px)]"
            >
                <SortableContext
                    id={id}
                    items={applications.map(app => app.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {applications.map(app => (
                        <KanbanCard key={app.id} application={app} />
                    ))}
                </SortableContext>
            </ScrollArea>
        </div>
    );
}
