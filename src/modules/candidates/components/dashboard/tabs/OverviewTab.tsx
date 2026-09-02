
'use client';

import React, { useState, useEffect } from 'react';
import { User, Application, Notification } from "@/types";
import { Interview } from '@/modules/interviews/domain/interview.entity';
import { CandidateStats } from "../stats";
import { UpcomingInterviews } from "../upcoming-interviews";
import { Notifications } from "../notifications";
import { applicationService } from "@/services/application.service";
import { interviewService } from "@/services/interview.service";
import { notificationService } from "@/services/notification.service";
import { Skeleton } from '@/components/ui/skeleton';

interface OverviewTabProps {
    user: User;
}

export function OverviewTab({ user }: OverviewTabProps) {
    const [applications, setApplications] = useState<Application[]>([]);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const [userApplications, userInterviews, userNotifications] = await Promise.all([
                    applicationService.getApplicationsForUser(user.id),
                    interviewService.getInterviewsForCandidate(user.id),
                    notificationService.getNotificationsForCandidate(user.id),
                ]);

                setApplications(userApplications);
                setInterviews(userInterviews);
                setNotifications(userNotifications as Notification[]);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
            } finally {
                setIsLoadingData(false);
            }
        };
        
        fetchData();
    }, [user.id]);

    return (
        <div className="space-y-8">
            <CandidateStats applications={applications} />
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <UpcomingInterviews interviews={interviews} isLoading={isLoadingData} />
                </div>
                <div className="lg:col-span-1">
                    <Notifications notifications={notifications} isLoading={isLoadingData} />
                </div>
            </div>
        </div>
    );
}
