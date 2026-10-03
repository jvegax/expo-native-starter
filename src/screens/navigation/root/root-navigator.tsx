import { Stack } from 'expo-router';

import { selectIsSignedIn, useSessionStore } from '@/features/auth/store/session/session.store';

/**
 * The auth gate. The ONLY place that decides between the signed-in app and the auth flow.
 *
 * Stack.Protected removes a group from the navigator while its guard is false, and React Navigation
 * then moves to the first route still available. So signing in or out needs no router.replace:
 * flipping the session status swaps (auth) for (app) (and drops the history behind it), and a deep
 * link into (app) while signed out lands on sign-in.
 *
 * Rendered by src/app/_layout.tsx. It lives in screens/ because routes may not import features.
 */
export function RootNavigator() {
  const isSignedIn = useSessionStore(selectIsSignedIn);

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" options={{ headerShown: true, animation: 'default' }} />
    </Stack>
  );
}
