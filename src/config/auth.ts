import { queryClient } from '@/config/query-client';
import { queryPersister } from '@/config/query-persister';
import { selectIsSignedIn, useSessionStore } from '@/features/auth/store/session/session.store';

/**
 * Reacts to the end of a session, whatever caused it (sign out button, a 401, an auth SDK listener):
 * drops the in-memory query cache and its persisted copy so the next user never sees the previous
 * user's data. Navigation needs nothing here: the root Stack.Protected guards follow the store.
 */
export function setupAuth(): void {
  useSessionStore.subscribe((state, previous) => {
    if (selectIsSignedIn(previous) && !selectIsSignedIn(state)) {
      queryClient.clear();
      void queryPersister.removeClient();
    }
  });
}
