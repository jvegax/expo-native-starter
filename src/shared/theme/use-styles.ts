import type { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';
import { useTheme } from '@/shared/theme/use-theme';

type NamedStyles<T> = StyleSheet.NamedStyles<T>;
type StyleFactory<T> = (theme: Theme) => T;

// One style object per (factory, theme), shared by every instance of every component that uses it.
// Weak keys: a factory or theme that is no longer referenced (fast refresh) is garbage collected.
const cache = new WeakMap<StyleFactory<object>, WeakMap<Theme, object>>();

function getStyles<T extends object>(createStyles: StyleFactory<T>, theme: Theme): T {
  let byTheme = cache.get(createStyles);
  if (!byTheme) {
    byTheme = new WeakMap();
    cache.set(createStyles, byTheme);
  }
  let styles = byTheme.get(theme) as T | undefined;
  if (!styles) {
    styles = createStyles(theme);
    byTheme.set(theme, styles);
  }
  return styles;
}

/**
 * Builds a StyleSheet from the current theme, once per theme for the whole app (module cache).
 * Declare `createStyles` at module scope in a `.styles.ts` file so the reference is stable.
 */
export function useStyles<T extends NamedStyles<T>>(createStyles: StyleFactory<T>): T {
  const theme = useTheme();
  return getStyles(createStyles, theme);
}
