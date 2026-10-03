import type { Session, User } from '@/features/auth/types/session/session.types';
import { STORAGE_KEYS } from '@/shared/constants/storage-keys';
import { storage } from '@/shared/lib/storage/storage';

// The session is stored by hand instead of with zustand `persist`: the token must go to the
// keychain/keystore (STORAGE_KEYS.authToken is a SECRET_KEY), and `persist` only writes to MMKV.
// Both reads are synchronous, so the store knows the session on its first render (no splash delay).

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  const user = value as Record<string, unknown>;
  return typeof user.id === 'string' && typeof user.name === 'string' && typeof user.email === 'string';
}

function readUser(): User | null {
  const raw = storage.get(STORAGE_KEYS.authUser);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isUser(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** The stored session, or null when either half is missing or unreadable (treated as signed out). */
export function readStoredSession(): Session | null {
  const token = storage.get(STORAGE_KEYS.authToken);
  const user = readUser();
  return token && user ? { token, user } : null;
}

export function writeStoredSession({ token, user }: Session): void {
  storage.set(STORAGE_KEYS.authToken, token);
  storage.set(STORAGE_KEYS.authUser, JSON.stringify(user));
}

export function clearStoredSession(): void {
  storage.remove(STORAGE_KEYS.authToken);
  storage.remove(STORAGE_KEYS.authUser);
}
