import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
  });
