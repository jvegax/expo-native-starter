import { Stack } from 'expo-router';

import { HeaderMenuButton } from '@/screens/navigation/section/header-menu-button';

/**
 * The native Stack every drawer/tab section renders (home, clubs, profile, settings), so each
 * section keeps its own history and gets native headers (large titles, Liquid Glass on iOS 26).
 * The menu button goes on the section's root screen only: in screenOptions it would replace the
 * back button of every pushed screen. Screens set their own title with <Stack.Screen options>.
 */
export function SectionStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        freezeOnBlur: true,
        headerLargeTitleShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerLargeTitleEnabled: true, headerLeft: () => <HeaderMenuButton /> }}
      />
    </Stack>
  );
}
