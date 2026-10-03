import { useMutation } from '@tanstack/react-query';

import { signOut } from '@/features/auth/api/session/sign-out.api';
import { useSessionStore } from '@/features/auth/store/session/session.store';

export function useSignOutMutation() {
  const clearSession = useSessionStore((state) => state.clearSession);

  return useMutation({
    mutationFn: signOut,
    // Never pause offline: a paused mutation would not settle, so the user would stay signed in
    // until the connection returns and then be signed out mid-task.
    networkMode: 'always',
    // onSettled, not onSuccess: the user is signed out locally even if the server call fails.
    // The query cache is cleared by src/config/auth.ts, which reacts to every sign out (401s included).
    onSettled: clearSession,
  });
}
