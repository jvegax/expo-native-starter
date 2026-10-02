import { ActivityIndicator, Platform, Pressable, type PressableProps } from 'react-native';

import type { ThemeColor } from '@/shared/theme/theme.types';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { createStyles } from '@/shared/ui/button/button.styles';
import { Text } from '@/shared/ui/text/text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const LABEL_COLOR: Record<ButtonVariant, ThemeColor> = {
  primary: 'onPrimary',
  secondary: 'text',
  ghost: 'primary',
};

const isAndroid = Platform.OS === 'android';

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const labelColor = LABEL_COLOR[variant];
  const style = [styles.base, styles[size], styles[variant], isDisabled && styles.disabled];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      // Android: native ripple and a static style, so a press never re-renders the button.
      // iOS: the pressed style is the feedback.
      android_ripple={onPress ? { color: theme.colors.ripple, foreground: true } : undefined}
      style={isAndroid ? style : ({ pressed }) => [style, pressed && styles[`${variant}Pressed`]]}
      {...rest}
    >
      {loading ? <ActivityIndicator size="small" color={theme.colors[labelColor]} /> : null}
      <Text variant="label" color={labelColor}>
        {label}
      </Text>
    </Pressable>
  );
}
