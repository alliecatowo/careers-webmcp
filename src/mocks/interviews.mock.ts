
import { Interview, InterviewStatus } from "@/modules/interviews/domain/interview.entity";

export const mockInterviews: Interview[] = [
    {
        id: 'interview-1',
        applicationId: 'app-1',
        candidateId: 'candidate-1',
        candidateName: 'John Doe',
        jobTitle: 'Senior Frontend Engineer',
        stage: 'TECHNICAL_ROUND',
        scheduledAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        interviewerIds: ['4'],
        interviewerNames: ['Elon Musk (Stark)'],
        meetingLink: 'https://meet.baalvion.com/xyz-123',
        status: 'SCHEDULED',
        createdAt: new Date().toISOString()
    },
    {
        id: 'interview-2',
        applicationId: 'app-2',
        candidateId: 'candidate-2',
        candidateName: 'Jane Smith',
        jobTitle: 'Senior Frontend Engineer',
        stage: 'FINAL_ROUND',
        scheduledAt: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        interviewerIds: ['2', '4'],
        interviewerNames: ['Recruiter (Acme)', 'Elon Musk (Stark)'],
        meetingLink: 'https://meet.baalvion.com/abc-456',
        status: 'SCHEDULED',
        createdAt: new Date().toISOString()
    },
];
