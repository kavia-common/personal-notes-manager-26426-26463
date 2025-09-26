import {
  component$,
  Slot,
  createContextId,
  useContextProvider,
} from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { useNotesStore, type UseNotesStoreReturn } from '~/store/note-store';
import { Sidebar } from '~/components/sidebar/sidebar';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

export const NoteStoreContext =
  createContextId<UseNotesStoreReturn>('note-store-context');

// PUBLIC_INTERFACE
export default component$(() => {
  const notesStore = useNotesStore();
  useContextProvider(NoteStoreContext, notesStore);

  // No need to import styles.css here, global.css handles layout

  return (
    <div class="app-container">
      <Sidebar />
      <main class="main-content">
        <Slot />
      </main>
    </div>
  );
});
