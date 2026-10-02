import { DarkTheme, DefaultTheme, type Theme as NavigationTheme } from 'expo-router';

import type { Theme } from '@/shared/theme/theme.types';
import { darkTheme, lightTheme } from '@/shared/theme/themes';

// Native headers, tab bars and the screen background behind transitions read React Navigation's
// theme, not ours. Mapping our tokens onto it keeps them in sync (no white header or flash in dark mode).
function toNavigationTheme(base: NavigationTheme, theme: Theme): NavigationTheme {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };
}

export const lightNavigationTheme = toNavigationTheme(DefaultTheme, lightTheme);
export const darkNavigationTheme = toNavigationTheme(DarkTheme, darkTheme);
