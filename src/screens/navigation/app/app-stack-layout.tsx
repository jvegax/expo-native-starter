import { Stack } from 'expo-router';

/**
 * Signed-in root stack. The drawer (with the tabs inside) is its first screen; anything pushed here
 * covers the drawer AND the tab bar, the native equivalent of hidesBottomBarWhenPushed. Use it for
 * full-screen flows (details/[id]) and modals or sheets. Pushes that should keep the tab bar visible
 * go in the tab's own stack instead (clubs/[clubId]).
 */
export function AppStackLayout() {
  return (
    // freezeOnBlur: on Fabric, screens two or more levels below the top stop re-rendering; the one
    // right below stays live so the back gesture and its animations work.
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal', freezeOnBlur: true }}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="details/[id]" />
      <Stack.Screen
        name="sheet"
        options={{
          presentation: 'formSheet',
          headerShown: false,
          sheetAllowedDetents: [0.4, 1],
          sheetGrabberVisible: true,
          sheetCornerRadius: 24,
        }}
      />
    </Stack>
  );
}
