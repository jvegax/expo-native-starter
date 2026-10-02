export const STORAGE_KEYS = {
  authToken: 'auth.token',
  language: 'settings.language',
  queryCache: 'query.cache',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Keys that go to the OS keychain/keystore (expo-secure-store) instead of MMKV. */
export const SECRET_KEYS: ReadonlySet<StorageKey> = new Set([STORAGE_KEYS.authToken]);
