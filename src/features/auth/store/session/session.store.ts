import { create } from 'zustand';

import {
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
} from '@/features/auth/store/session/session.storage';
import type { Session, SessionStatus, User } from '@/features/auth/types/session/session.types';

type SessionState = {
  status: SessionStatus;
  token: string | null;
  user: User | null;
};

type SessionActions = {
  /** Called after a successful sign in / sign up (or by an auth SDK listener). */
  setSession: (session: Session) => void;
  /** Called on sign out and on any 401 (src/config/http.ts). Idempotent. */
  clearSession: () => void;
};

const signedOutState: SessionState = { status: 'signedOut', token: null, user: null };

function toState(session: Session | null): SessionState {
  return session ? { status: 'signedIn', token: session.token, user: session.user } : signedOutState;
}

/**
 * Client-side session. Seeded synchronously from storage when the module loads, so the root
 * navigator's guard is correct on the very first render (no flash of the sign-in screen).
 */
export const useSessionStore = create<SessionState & SessionActions>()((set) => ({
  ...toState(readStoredSession()),
  setSession: (session) => {
    writeStoredSession(session);
    set(toState(session));
  },
  clearSession: () => {
    clearStoredSession();
    set(signedOutState);
  },
}));

/**
 * The navigation contract: the root navigator's Stack.Protected guards read only this.
 * Real auth keeps it unchanged; whatever signs the user in ends up calling setSession.
 */
export const selectIsSignedIn = (state: SessionState) => state.status === 'signedIn';

export const selectUser = (state: SessionState) => state.user;

/** Bearer token for the http client (src/config/http.ts). */
export const selectToken = (state: SessionState) => state.token;
