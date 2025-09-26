import { component$, useContext, useTask$ } from '@builder.io/qwik';
import { type DocumentHead, useNavigate } from '@builder.io/qwik-city';
import { NoteStoreContext } from './layout';

// PUBLIC_INTERFACE
export default component$(() => {
  const { notesStore } = useContext(NoteStoreContext);
  const nav = useNavigate();

  // If there are notes, redirect to the first one
  useTask$(({ track }) => {
    track(() => notesStore.notes);
    if (notesStore.notes.length > 0) {
      if (notesStore.activeNoteId) {
        nav(`/${notesStore.activeNoteId}/`);
      } else {
        const firstNoteId = notesStore.notes[0].id;
        nav(`/${firstNoteId}/`);
      }
    }
  });

  return (
    <div class="welcome-container">
      <h1 class="welcome-title">Welcome to Qwik Notes</h1>
      <p class="welcome-text">Select a note from the sidebar to start editing, or create a new one.</p>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Qwik Notes',
  meta: [
    {
      name: 'description',
      content: 'A simple and fast note-taking app built with Qwik.',
    },
  ],
};
