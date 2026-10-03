import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flexGrow: 1,
      gap: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    padded: {
      paddingHorizontal: theme.spacing.md,
    },
  });
