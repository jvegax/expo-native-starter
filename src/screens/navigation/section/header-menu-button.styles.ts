import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      width: theme.sizes.touchTarget,
      height: theme.sizes.touchTarget,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.5,
    },
  });
