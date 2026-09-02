
import { Note } from "@/types";

let mockNotes: Note[] = [
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

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const noteMockService = {
    async getNotesForCandidate(candidateId: string): Promise<Note[]> {
        await delay(200);
        return mockNotes
            .filter(n => n.candidateId === candidateId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    async addNote(noteData: Partial<Note>): Promise<Note> {
        await delay(400);
        const newNote: Note = {
            id: `note-${Date.now()}`,
            createdAt: new Date(),
            ...noteData
        } as Note;
        mockNotes.push(newNote);
        return newNote;
    },
}
