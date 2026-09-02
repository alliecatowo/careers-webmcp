
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { noteService } from "@/services/note.service";
import { Note } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/system/Toast/useToast";

interface NotesTabProps {
    candidateId: string;
    initialNotes: Note[];
}

export function NotesTab({ candidateId, initialNotes }: NotesTabProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [notes, setNotes] = useState(initialNotes);
    const [newNote, setNewNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const addedNote = await noteService.addNote({
                candidateId,
                content: newNote,
                authorId: user.id,
                authorName: user.name,
            });
            setNotes([addedNote, ...notes]);
            setNewNote("");
            showToast({ type: 'success', title: 'Note Added', description: 'Your note has been saved.' });
        } catch (error) {
            showToast({ type: 'error', title: 'Failed to add note', description: 'An error occurred while saving.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Textarea
                        placeholder="Add a new note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <Button onClick={handleAddNote} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 animate-spin" />}
                        Add Note
                    </Button>
                </div>
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {notes.length > 0 ? (
                        notes.map(note => (
                            <div key={note.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{note.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{note.authorName}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</p>
                                    <p className="mt-2 text-sm">{note.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No notes for this candidate yet.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
