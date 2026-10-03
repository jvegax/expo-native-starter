import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      gap: theme.spacing.sm,
    },
    title: {
      paddingHorizontal: theme.spacing.md,
    },
    // The border colour shows through the hairline gap between rows: separators with no extra views.
    group: {
      gap: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      borderRadius: theme.radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
  });
