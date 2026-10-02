import { Platform, StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
      ...theme.shadows.sm,
      // Clips the Android foreground ripple to the radius. Not on iOS, where overflow plus a
      // boxShadow costs an extra native view.
      ...Platform.select({ android: { overflow: 'hidden' as const } }),
    },
    pressed: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    name: {
      flexShrink: 1,
    },
  });
