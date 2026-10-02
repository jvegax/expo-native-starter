import type { Query } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { ReactNode } from 'react';

import { env } from '@/config/env';
import { queryClient } from '@/config/query-client';
import { QUERY_CACHE_MAX_AGE, queryPersister } from '@/config/query-persister';

// Persistence is opt-in per query (`meta: { persist: true }`): only successful, non-sensitive data
// reaches disk. A new app version (buster) discards the old cache, since its shape may have changed.
function shouldPersistQuery(query: Query): boolean {
  return query.state.status === 'success' && query.meta?.persist === true;
}

const persistOptions = {
  persister: queryPersister,
  maxAge: QUERY_CACHE_MAX_AGE,
  buster: env.APP_VERSION,
  // Paused offline mutations are not persisted: resuming them needs setMutationDefaults per
  // mutation key, and their variables (e.g. an invited email) are personal data.
  dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery, shouldDehydrateMutation: () => false },
};

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
}
