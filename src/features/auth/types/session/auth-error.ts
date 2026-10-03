import type { AuthErrorCode } from '@/features/auth/types/session/session.types';

/**
 * Expected auth failure (wrong password, email already registered). Screens show `auth:errors.<code>`;
 * anything else (network, 5xx) arrives as an HttpError and falls back to the generic message.
 */
export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
  }
}
