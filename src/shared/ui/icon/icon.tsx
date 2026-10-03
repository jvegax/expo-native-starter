import { type AndroidSymbol, type SFSymbol, SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/shared/theme/use-theme';

export type IconProps = {
  /** SF Symbol name (iOS), see the SF Symbols app. */
  ios: SFSymbol;
  /** Material Symbol name (Android), see fonts.google.com/icons. */
  android: AndroidSymbol;
  size?: number;
  /** Raw colour, because navigation APIs (drawerIcon, header buttons) hand one over. Defaults to `text`. */
  color?: ColorValue;
};

/**
 * Platform-native, decorative icon: SF Symbols on iOS, Material Symbols on Android (expo-symbols
 * draws them from the Material Symbols font, loaded on first use, so an icon can appear a frame late).
 * The surrounding control carries the accessible label.
 */
export function Icon({ ios, android, size, color }: IconProps) {
  const theme = useTheme();

  return (
    <SymbolView
      name={{ ios, android }}
      size={size ?? theme.sizes.iconMd}
      tintColor={color ?? theme.colors.text}
      // Decorative: without these, VoiceOver reads the symbol name ("plain text document") inside
      // the label of the surrounding button.
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
