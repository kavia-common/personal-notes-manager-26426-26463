import { component$, useContext } from '@builder.io/qwik';
import { useLocation, type DocumentHead } from '@builder.io/qwik-city';
import { NoteEditor } from '~/components/note-editor/note-editor';
import { NoteStoreContext } from '~/routes/layout';

// PUBLIC_INTERFACE
export default component$(() => {
  const location = useLocation();
  const { notesStore, setActiveNoteId } = useContext(NoteStoreContext);

  const noteId = location.params.noteId;
  const note = notesStore.notes.find((n) => n.id === noteId);

  // set active note on load
  setActiveNoteId(noteId);

  if (!note) {
    return (
        <div class="note-not-found">
            <h2>Note not found</h2>
            <p>The note you are looking for does not exist.</p>
        </div>
    );
  }

  return <NoteEditor note={note} />;
});

export const head: DocumentHead = {
    title: 'Note - Qwik Notes',
};
