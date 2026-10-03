import { Stack } from 'expo-router';

/** Signed-out flow: sign-in is the root, sign-up is pushed with the native back gesture. */
export function AuthStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerLargeTitleEnabled: true,
        headerLargeTitleShadowVisible: false,
        headerShadowVisible: false,
      }}
    />
  );
}
