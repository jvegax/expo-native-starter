import { useContext } from 'react';

import { ThemeContext } from '@/shared/theme/theme-context';
import type { Theme } from '@/shared/theme/theme.types';

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside <ThemeProvider> (see src/providers/app-providers.tsx)');
  }
  return theme;
}
