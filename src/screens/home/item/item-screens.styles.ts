import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    placeholder: {
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    actions: {
      gap: theme.spacing.sm,
    },
    sheet: {
      flex: 1,
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
  });
