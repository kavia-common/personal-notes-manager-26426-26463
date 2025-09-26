import { useStore, $, type QRL } from '@builder.io/qwik';
import type { Note } from '~/types';
import { v4 as uuidv4 } from 'uuid';

export interface NotesStore {
  notes: Note[];
  activeNoteId: string | null;
}

const NOTE_STORAGE_KEY = 'qwik-notes';

export const getInitialStore = (): NotesStore => {
  if (typeof window !== 'undefined') {
    const savedNotes = window.localStorage.getItem(NOTE_STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        return {
          notes: parsedNotes,
          activeNoteId: parsedNotes.length > 0 ? parsedNotes[0].id : null,
        };
      } catch (e) {
        console.error("Failed to parse notes from localStorage", e);
        return { notes: [], activeNoteId: null };
      }
    }
  }
  return { notes: [], activeNoteId: null };
};

export const useNotesStore = () => {
  const notesStore = useStore<NotesStore>(getInitialStore());

  const saveNotesToLocalStorage = $(() => {
    localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notesStore.notes));
  });

  const createNote = $(async () => {
    const newNote: Note = {
      id: uuidv4(),
      title: "New Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notesStore.notes = [newNote, ...notesStore.notes];
    notesStore.activeNoteId = newNote.id;
    await saveNotesToLocalStorage();
    return newNote.id;
  });

  const updateNote = $((noteId: string, title: string, content: string) => {
    const note = notesStore.notes.find((n) => n.id === noteId);
    if (note) {
      note.title = title;
      note.content = content;
      note.updatedAt = new Date().toISOString();
      // move to top
      notesStore.notes = [
        note,
        ...notesStore.notes.filter((n: Note) => n.id !== noteId),
      ];
      saveNotesToLocalStorage();
    }
  });

  const deleteNote = $((noteId: string) => {
    notesStore.notes = notesStore.notes.filter((n: Note) => n.id !== noteId);
    if (notesStore.activeNoteId === noteId) {
      notesStore.activeNoteId = notesStore.notes[0]?.id || null;
    }
    saveNotesToLocalStorage();
  });

  const setActiveNoteId = $((noteId: string | null) => {
    notesStore.activeNoteId = noteId;
  });

  return {
    notesStore,
    createNote,
    updateNote,
    deleteNote,
    setActiveNoteId
  };
};

export type UseNotesStoreReturn = {
  notesStore: NotesStore;
  createNote: QRL<() => Promise<string>>;
  updateNote: QRL<(noteId: string, title: string, content: string) => void>;
  deleteNote: QRL<(noteId: string) => void>;
  setActiveNoteId: QRL<(noteId: string | null) => void>;
};
