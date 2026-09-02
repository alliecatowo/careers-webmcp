
'use client';

import { useState, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { applicationService } from '@/services/application.service';
import { ApplicationStatus, ApplicationWithCandidate, applicationStatuses } from '@/types';
import { useToast } from '@/hooks/use-toast';

type ApplicationGroups = Record<ApplicationStatus, ApplicationWithCandidate[]>;

interface KanbanBoardProps {
    initialApplications: ApplicationWithCandidate[];
    jobId: string;
}

const STAGE_TITLES: Record<ApplicationStatus, string> = {
    APPLIED: 'Applied',
    SCREENED: 'Screening',
    TECHNICAL_ROUND: 'Technical Round',
    HR_ROUND: 'HR Round',
    FINAL_ROUND: 'Final Round',
    OFFER: 'Offer Extended',
    HIRED: 'Hired',
    REJECTED: 'Rejected',
    INTERVIEW: 'Interview',
    PLACED: 'Placed',
};

export function KanbanBoard({ initialApplications, jobId }: KanbanBoardProps) {
    const { toast } = useToast();
    const [applications, setApplications] = useState<ApplicationGroups>(() => {
        const groups: ApplicationGroups = {} as ApplicationGroups;
        applicationStatuses.forEach(status => {
            groups[status] = [];
        });
        initialApplications.forEach(app => {
            if (groups[app.status]) {
                groups[app.status].push(app);
            }
        });
        return groups;
    });

    const [activeApplication, setActiveApplication] = useState<ApplicationWithCandidate | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const findContainer = (id: string) => {
        if (id in applications) {
            return id as ApplicationStatus;
        }
        return applicationStatuses.find((key) => applications[key].some(app => app.id === id));
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const activeId = String(active.id);
        const container = findContainer(activeId);
        if (container) {
            setActiveApplication(applications[container].find(app => app.id === activeId) || null);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setApplications(prev => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex(item => item.id === activeId);
            const overIndex = overItems.findIndex(item => item.id === overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowLastItem = over && overIndex === overItems.length - 1;
                const modifier = isBelowLastItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: activeItems.filter(item => item.id !== activeId),
                [overContainer]: [
                    ...overItems.slice(0, newIndex),
                    activeItems[activeIndex],
                    ...overItems.slice(newIndex)
                ].filter(Boolean),
            };
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) {
            setActiveApplication(null);
            return;
        }

        const activeId = String(active.id);
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(String(over.id));

        if (!activeContainer || !overContainer) {
            setActiveApplication(null);
            return;
        }

        const newStage = overContainer;
        const oldStage = activeContainer;

        if (oldStage !== newStage) {
            // Optimistic update has already happened in onDragOver
            // Now, call the service to persist the change
            try {
                await applicationService.updateApplicationStatus(activeId, newStage);
                toast({
                    title: "Status Updated",
                    description: `${activeApplication?.candidateName} moved to ${STAGE_TITLES[newStage]}.`,
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: "Could not update candidate status. Reverting change.",
                });
                // Revert UI on failure
                setApplications(prev => {
                    const movedApp = applications[newStage].find(app => app.id === activeId);
                    if (!movedApp) return prev;

                    return {
                        ...prev,
                        [newStage]: prev[newStage].filter(app => app.id !== activeId),
                        [oldStage]: [...prev[oldStage], movedApp]
                    }
                });
            }
        }

        setActiveApplication(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 overflow-x-auto pb-4">
                {applicationStatuses.map(status => (
                    <KanbanColumn
                        key={status}
                        id={status}
                        title={STAGE_TITLES[status]}
                        applications={applications[status]}
                    />
                ))}
            </div>
        </DndContext>
    );
}
