import { component$, useStyles$, useContext } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { NoteStoreContext } from '~/routes/layout';
import { IconPlus } from '../icons/icon-plus';
import styles from './sidebar.css?inline';

export const Sidebar = component$(() => {
  useStyles$(styles);
  const { notesStore, createNote, setActiveNoteId } = useContext(NoteStoreContext);
  const nav = useNavigate();

  return (
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Qwik Notes</h1>
        <button
          class="new-note-btn"
          onClick$={async () => {
            const newNoteId = await createNote();
            nav(`/${newNoteId}`);
          }}
        >
          <IconPlus />
        </button>
      </div>
      <div class="notes-list">
        {notesStore.notes.length === 0 && (
          <p class="empty-list-message">No notes yet.</p>
        )}
        {notesStore.notes.map((note) => (
          <Link
            key={note.id}
            href={`/${note.id}/`}
            class={{
              'note-item': true,
              'active': notesStore.activeNoteId === note.id,
            }}
            onClick$={() => setActiveNoteId(note.id)}
          >
            <h2 class="note-item-title">{note.title || 'Untitled Note'}</h2>
            <p class="note-item-excerpt">
              {note.content.substring(0, 40) || 'No content'}
            </p>
            <span class="note-item-date">
              {new Date(note.updatedAt).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
});
