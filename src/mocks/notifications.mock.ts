
import { Notification } from "@/types";

export const mockNotifications: Notification[] = [
    {
        id: 'notif-1',
        candidateId: 'candidate-4', // Corresponds to Elena Rodriguez
        type: 'STAGE_UPDATE',
        message: 'Your application for Frontend Developer was moved to Screening.',
        read: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
        id: 'notif-2',
        candidateId: 'candidate-4',
        type: 'INTERVIEW_SCHEDULED',
        message: 'A new interview has been scheduled for you.',
        read: false,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        id: 'notif-3',
        candidateId: 'candidate-4',
        type: 'DOCUMENT_REQUEST',
        message: 'A document has been requested for your application.',
        read: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    }
];
