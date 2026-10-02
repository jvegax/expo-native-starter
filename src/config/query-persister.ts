import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { STORAGE_KEYS } from '@/shared/constants/storage-keys';
import { persistStorage } from '@/shared/lib/storage/storage';

/** Persisted entries older than this are discarded on restore. gcTime must be at least as long. */
export const QUERY_CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

// Writes the opt-in part of the cache (queries with `meta: { persist: true }`) to MMKV, at most
// once per second, so the next cold start renders cached lists before the network answers.
export const queryPersister = createAsyncStoragePersister({
  storage: persistStorage,
  key: STORAGE_KEYS.queryCache,
  throttleTime: 1000,
});
