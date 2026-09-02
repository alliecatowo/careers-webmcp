
export type NotificationType = "STAGE_UPDATE" | "INTERVIEW_SCHEDULED" | "DOCUMENT_REQUEST";

export interface Notification {
    id: string;
    candidateId: string;
    type: NotificationType;
    message: string;
    read: boolean;
    createdAt: Date;
}
