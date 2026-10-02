import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import type { ThemeColor } from '@/shared/theme/theme.types';
import type { TextVariant } from '@/shared/theme/tokens/typography';
import { useTheme } from '@/shared/theme/use-theme';

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ThemeColor;
  align?: 'left' | 'center' | 'right';
};

export function Text({ variant = 'body', color = 'text', align, style, ...rest }: TextProps) {
  const theme = useTheme();

  return (
    <RNText
      style={[theme.textVariants[variant], { color: theme.colors[color], textAlign: align }, style]}
      {...rest}
    />
  );
}
