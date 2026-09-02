
import { Note } from "@/types";

export const mockNotes: Note[] = [
    {
        id: 'note-1',
        candidateId: '1',
        authorId: '2',
        authorName: 'Recruiter (Acme)',
        content: 'Excellent initial screening call. Strong communication skills and seems like a great culture fit.',
        createdAt: new Date('2023-10-02T10:00:00Z')
    },
    {
        id: 'note-2',
        candidateId: '1',
        authorId: '4',
        authorName: 'Elon Musk (Stark)',
        content: 'Technical assessment was flawless. Deep understanding of React and system design principles.',
        createdAt: new Date('2023-10-06T14:30:00Z')
    }
];
