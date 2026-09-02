import { apiClient } from '@/lib/apiClient';
import { Note } from '@/types';

// This is a placeholder for the real API service.
export const noteServerService = {
  async getNotesForCandidate(candidateId: string): Promise<Note[]> {
    const response = await apiClient.get<Note[]>(
      `/candidates/${candidateId}/notes`,
    );
    if (!response.success)
      throw new Error(response.error || 'Failed to fetch notes');
    return (response.data as Note[]) || [];
  },
  async addNote(noteData: Partial<Note>): Promise<Note> {
    const response = await apiClient.post<Note>('/notes', noteData);
    if (!response.success)
      throw new Error(response.error || 'Failed to add note');
    return response.data as Note;
  },
};
