import { AuthError } from '@/features/auth/types/session/auth-error';
import type { Session, SignInInput, SignUpInput } from '@/features/auth/types/session/session.types';
import { PASSWORD_MIN_LENGTH } from '@/features/auth/utils/session/validate-credentials';

/**
 * MOCK AUTH BACKEND. The only file that fakes authentication; the api/session functions call it.
 * When real auth arrives, replace the bodies of the api functions and delete this file.
 *
 * Any email and any password of 6+ characters signs in. Two addresses exercise the error UI:
 * - error@example.com -> invalidCredentials (sign in and sign up)
 * - taken@example.com -> emailTaken (sign up)
 */
const LATENCY_MS = 700;
const FAILING_EMAIL = 'error@example.com';
const TAKEN_EMAIL = 'taken@example.com';

function delay(ms = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

function buildSession(email: string, name?: string): Session {
  const normalized = normalize(email);
  return {
    token: `mock.${normalized}.${Date.now()}`,
    user: { id: `user-${normalized}`, name: name?.trim() || normalized.split('@')[0], email: normalized },
  };
}

export async function mockSignIn({ email, password }: SignInInput): Promise<Session> {
  await delay();
  if (normalize(email) === FAILING_EMAIL || password.length < PASSWORD_MIN_LENGTH) {
    throw new AuthError('invalidCredentials');
  }
  return buildSession(email);
}

export async function mockSignUp({ name, email, password }: SignUpInput): Promise<Session> {
  await delay();
  if (normalize(email) === TAKEN_EMAIL) throw new AuthError('emailTaken');
  if (normalize(email) === FAILING_EMAIL || password.length < PASSWORD_MIN_LENGTH) {
    throw new AuthError('invalidCredentials');
  }
  return buildSession(email, name);
}

export async function mockSignOut(): Promise<void> {
  await delay(300);
}
