import { useMutation } from '@tanstack/react-query';

import { signUp } from '@/features/auth/api/session/sign-up.api';
import { useSessionStore } from '@/features/auth/store/session/session.store';

export function useSignUpMutation() {
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: signUp,
    // Run even offline: a real request then fails fast with a network error instead of pausing
    // until the connection returns (the button would spin forever).
    networkMode: 'always',
    onSuccess: setSession,
  });
}
