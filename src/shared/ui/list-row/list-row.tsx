import type { ReactNode } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { Icon } from '@/shared/ui/icon/icon';
import { createStyles } from '@/shared/ui/list-row/list-row.styles';
import { Text } from '@/shared/ui/text/text';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Leading element, usually an <Icon>. */
  icon?: ReactNode;
  onPress?: () => void;
};

const isAndroid = Platform.OS === 'android';

/**
 * Settings-style row. iOS: pressed highlight and a trailing chevron when it navigates.
 * Android: Material ripple and no chevron (Material lists do not use disclosure indicators).
 */
export function ListRow({ title, subtitle, icon, onPress }: ListRowProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      // Explicit label: otherwise iOS also reads the icon and chevron ("Forward").
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      onPress={onPress}
      android_ripple={onPress ? { color: theme.colors.ripple, foreground: true } : undefined}
      style={isAndroid || !onPress ? styles.row : ({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {icon}
      <View style={styles.texts}>
        <Text>{title}</Text>
        {subtitle ? (
          <Text variant="caption" color="textMuted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onPress && !isAndroid ? (
        <Icon ios="chevron.right" android="chevron_right" size={theme.sizes.iconSm} color={theme.colors.textMuted} />
      ) : null}
    </Pressable>
  );
}
