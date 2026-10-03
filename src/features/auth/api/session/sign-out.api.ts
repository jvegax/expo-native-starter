import { mockSignOut } from '@/features/auth/utils/session/mock-auth';

/**
 * Auth seam: tells the backend the session is over (revoke token / refresh token).
 * The local session is cleared by useSignOutMutation whether or not this call succeeds.
 *
 * REAL AUTH:
 *   await http.post<void>('/auth/sign-out');
 */
export async function signOut(): Promise<void> {
  return mockSignOut();
}
