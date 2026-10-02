import { deleteItemAsync, getItem, setItem } from 'expo-secure-store';
import { createMMKV } from 'react-native-mmkv';

import { SECRET_KEYS, type StorageKey } from '@/shared/constants/storage-keys';

export type Storage = {
  get: (key: StorageKey) => string | null;
  set: (key: StorageKey, value: string) => void;
  remove: (key: StorageKey) => void;
};

/** String-keyed adapter with the getItem/setItem/removeItem shape zustand `persist` and TanStack persisters expect. */
export type PersistStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

// Synchronous on purpose: values are available on the first render (language, token) with no
// loading state. Preferences live in MMKV (memory-mapped, JSI); secrets in the keychain/keystore.
const mmkv = createMMKV({ id: 'app-storage' });

// SecureStore reads cross the native bridge into the keychain, so each secret is read once per session.
const secretCache = new Map<StorageKey, string | null>();

function getSecret(key: StorageKey): string | null {
  if (secretCache.has(key)) return secretCache.get(key) ?? null;
  try {
    const value = getItem(key);
    secretCache.set(key, value);
    return value;
  } catch (error) {
    // Unreadable entry (e.g. keystore reset after a restore): behave as if it was never stored.
    console.warn(`storage: could not read secret "${key}"`, error);
    return null;
  }
}

function setSecret(key: StorageKey, value: string): void {
  setItem(key, value);
  secretCache.set(key, value);
}

function removeSecret(key: StorageKey): void {
  secretCache.set(key, null);
  // SecureStore has no synchronous delete. If a new value is set before the delete lands,
  // write it back so the async delete never wins over a newer token.
  deleteItemAsync(key)
    .then(() => {
      const latest = secretCache.get(key);
      if (latest != null) setItem(key, latest);
    })
    .catch((error: unknown) => console.error(`storage: could not delete secret "${key}"`, error));
}

export const storage: Storage = {
  get: (key) => (SECRET_KEYS.has(key) ? getSecret(key) : (mmkv.getString(key) ?? null)),
  set: (key, value) => {
    if (SECRET_KEYS.has(key)) setSecret(key, value);
    else mmkv.set(key, value);
  },
  remove: (key) => {
    if (SECRET_KEYS.has(key)) removeSecret(key);
    else mmkv.remove(key);
  },
};

// Non-secret, MMKV-only. Use it for zustand `persist` (createJSONStorage(() => persistStorage))
// and the TanStack Query persister; never for tokens.
export const persistStorage: PersistStorage = {
  getItem: (key) => mmkv.getString(key) ?? null,
  setItem: (key, value) => mmkv.set(key, value),
  removeItem: (key) => {
    mmkv.remove(key);
  },
};
