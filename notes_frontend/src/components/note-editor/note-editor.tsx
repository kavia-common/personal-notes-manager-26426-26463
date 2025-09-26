import { component$, useTask$, useContext, useStore, useStyles$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { NoteStoreContext } from '~/routes/layout';
import type { Note } from '~/types';
import { IconTrash } from '../icons/icon-trash';
import styles from './note-editor.css?inline';

interface NoteEditorProps {
  note: Note;
}

export const NoteEditor = component$<NoteEditorProps>((props) => {
  useStyles$(styles);
  const { notesStore, updateNote, deleteNote } = useContext(NoteStoreContext);
  const nav = useNavigate();

  const state = useStore({
    title: props.note.title,
    content: props.note.content,
    timeoutId: undefined as any,
  });

  // Update internal state when the note prop changes
  useTask$(({ track }) => {
    track(() => props.note.id);
    state.title = props.note.title;
    state.content = props.note.content;
  });

  // Debounced update to the store
  useTask$(({ track, cleanup }) => {
    track(() => state.title);
    track(() => state.content);

    cleanup(() => clearTimeout(state.timeoutId));

    state.timeoutId = setTimeout(() => {
      updateNote(props.note.id, state.title, state.content);
    }, 500);
  });

  return (
    <div class="note-editor">
      <div class="editor-header">
         <div class="editor-title-wrapper">
            <input
              class="editor-title"
              value={state.title}
              onInput$={(e) => (state.title = (e.target as HTMLInputElement).value)}
              placeholder="Title"
            />
         </div>
        <button
          class="delete-note-btn"
          onClick$={() => {
            if (confirm('Are you sure you want to delete this note?')) {
              deleteNote(props.note.id);
              const nextNoteId = notesStore.notes[0]?.id;
              if (nextNoteId) {
                nav(`/${nextNoteId}`);
              } else {
                nav('/');
              }
            }
          }}
        >
          <IconTrash />
        </button>
      </div>
      <textarea
        class="editor-content"
        value={state.content}
        onInput$={(e) => (state.content = (e.target as HTMLTextAreaElement).value)}
        placeholder="Start writing your note..."
      />
    </div>
  );
});
