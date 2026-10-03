import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    fields: {
      gap: theme.spacing.md,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  });
