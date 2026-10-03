import type { Session, SignInInput } from '@/features/auth/types/session/session.types';
import { mockSignIn } from '@/features/auth/utils/session/mock-auth';

/**
 * Auth seam: the signature is final, only the body changes when real auth arrives.
 *
 * REAL AUTH:
 *   const dto = await http.post<SessionDto>('/auth/sign-in', { body: input });
 *   return toSession(dto); // types/session/session.mappers.ts
 * Map an invalid-credentials response (e.g. HttpError status 401/422) to `new AuthError('invalidCredentials')`.
 */
export async function signIn(input: SignInInput): Promise<Session> {
  return mockSignIn(input);
}
