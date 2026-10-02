import { Platform, StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: 'transparent',
      // Clips the Android foreground ripple to the radius. Not on iOS, where overflow plus a
      // shadow costs an extra native view.
      ...Platform.select({ android: { overflow: 'hidden' as const } }),
    },
    md: { paddingVertical: theme.spacing.sm + theme.spacing.xs, paddingHorizontal: theme.spacing.lg },
    sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md },
    primary: { backgroundColor: theme.colors.primary },
    primaryPressed: { backgroundColor: theme.colors.primaryPressed },
    secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
    secondaryPressed: { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border },
    ghost: { backgroundColor: 'transparent' },
    ghostPressed: { backgroundColor: theme.colors.surfaceMuted },
    disabled: { opacity: 0.5 },
  });
