import type { Session, SignUpInput } from '@/features/auth/types/session/session.types';
import { mockSignUp } from '@/features/auth/utils/session/mock-auth';

/**
 * Auth seam: the signature is final, only the body changes when real auth arrives.
 *
 * REAL AUTH:
 *   const dto = await http.post<SessionDto>('/auth/sign-up', { body: input });
 *   return toSession(dto);
 * Map a duplicate-email response (e.g. HttpError status 409) to `new AuthError('emailTaken')`.
 */
export async function signUp(input: SignUpInput): Promise<Session> {
  return mockSignUp(input);
}
