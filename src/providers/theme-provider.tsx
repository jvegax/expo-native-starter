import { ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { type ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { darkNavigationTheme, lightNavigationTheme } from '@/shared/theme/navigation-theme';
import { ThemeContext } from '@/shared/theme/theme-context';
import { darkTheme, lightTheme } from '@/shared/theme/themes';

/** Provides our theme and the matching React Navigation theme, and keeps the native root view in sync. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  // The root view shows behind screen transitions and the keyboard; without this it stays the
  // app.config.ts `backgroundColor` (light) and flashes white in dark mode.
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  return (
    <NavigationThemeProvider value={isDark ? darkNavigationTheme : lightNavigationTheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </NavigationThemeProvider>
  );
}
