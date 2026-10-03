import { StyleSheet } from 'react-native';

import type { Theme } from '@/shared/theme/theme.types';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    // Only flexGrow: DrawerContentScrollView pads by the safe-area insets itself, and a padding here
    // would replace them (Sign out would sit under the home indicator / navigation bar).
    content: {
      flexGrow: 1,
    },
    header: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    spacer: {
      flex: 1,
    },
  });
