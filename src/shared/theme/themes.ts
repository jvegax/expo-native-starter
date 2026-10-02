import type { Theme, ThemeColors } from '@/shared/theme/theme.types';
import { palette } from '@/shared/theme/tokens/colors';
import { radii } from '@/shared/theme/tokens/radii';
import { shadows } from '@/shared/theme/tokens/shadows';
import { sizes } from '@/shared/theme/tokens/sizes';
import { spacing } from '@/shared/theme/tokens/spacing';
import { textVariants } from '@/shared/theme/tokens/typography';

const lightColors: ThemeColors = {
  background: palette.gray50,
  surface: palette.white,
  surfaceMuted: palette.gray100,
  text: palette.gray900,
  textMuted: palette.gray500,
  primary: palette.blue600,
  primaryPressed: palette.blue700,
  onPrimary: palette.white,
  border: palette.gray200,
  danger: palette.red500,
  success: palette.green500,
  ripple: palette.blackAlpha12,
};

const darkColors: ThemeColors = {
  background: palette.gray900,
  surface: palette.gray800,
  surfaceMuted: palette.gray700,
  text: palette.gray50,
  textMuted: palette.gray300,
  primary: palette.blue400,
  primaryPressed: palette.blue600,
  onPrimary: palette.gray900,
  border: palette.gray700,
  danger: palette.red500,
  success: palette.green500,
  ripple: palette.whiteAlpha20,
};

const shared = { spacing, radii, sizes, textVariants, shadows };

export const lightTheme: Theme = { mode: 'light', colors: lightColors, ...shared };
export const darkTheme: Theme = { mode: 'dark', colors: darkColors, ...shared };
