import { useMutation } from '@tanstack/react-query';

import { signIn } from '@/features/auth/api/session/sign-in.api';
import { useSessionStore } from '@/features/auth/store/session/session.store';

export function useSignInMutation() {
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: signIn,
    // Run even offline: a real request then fails fast with a network error instead of pausing
    // until the connection returns (the button would spin forever).
    networkMode: 'always',
    // Storing the session flips the root guard: the navigator swaps (auth) for (app) by itself.
    onSuccess: setSession,
  });
}
