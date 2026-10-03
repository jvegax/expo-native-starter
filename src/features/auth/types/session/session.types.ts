import type { Id } from '@/shared/types/common.types';

/** The signed-in person, as the app uses it. */
export type User = {
  id: Id;
  name: string;
  email: string;
};

/** What every auth api function resolves with: the bearer token plus the user it belongs to. */
export type Session = {
  token: string;
  user: User;
};

/** Navigation depends only on this value (see selectIsSignedIn in session.store.ts). */
export type SessionStatus = 'signedIn' | 'signedOut';

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = SignInInput & {
  name: string;
};

/** Failures the auth screens translate into a message (`auth:errors.<code>`). */
export type AuthErrorCode = 'invalidCredentials' | 'emailTaken';
