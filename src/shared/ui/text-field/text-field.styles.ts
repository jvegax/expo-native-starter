import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      gap: theme.spacing.xs,
    },
    input: {
      // Size and weight only: a lineHeight on a TextInput adds a paragraph style to the native text,
      // which iOS compares on every update. Error state changes the border, never text attributes.
      fontSize: theme.textVariants.body.fontSize,
      fontWeight: theme.textVariants.body.fontWeight,
      color: theme.colors.text,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      minHeight: theme.sizes.touchTarget,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
  });
