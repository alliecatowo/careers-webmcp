
import { Note } from '@/types';
import { adapter } from './adapter';

export const noteService = {
  getNotesForCandidate: (candidateId: string): Promise<Note[]> => adapter.getNotesForCandidate(candidateId),
  addNote: (noteData: Partial<Note>): Promise<Note> => adapter.addNote(noteData),
};
