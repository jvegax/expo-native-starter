import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    list: {
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
  });
