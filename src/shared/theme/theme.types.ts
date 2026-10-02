import type { radii } from '@/shared/theme/tokens/radii';
import type { shadows } from '@/shared/theme/tokens/shadows';
import type { sizes } from '@/shared/theme/tokens/sizes';
import type { spacing } from '@/shared/theme/tokens/spacing';
import type { textVariants } from '@/shared/theme/tokens/typography';

export type ThemeMode = 'light' | 'dark';

/** Semantic colors: name the role, not the hue. */
export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  border: string;
  danger: string;
  success: string;
  /** Android press ripple drawn over pressables (translucent, so content stays readable). */
  ripple: string;
};

export type Theme = {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  sizes: typeof sizes;
  textVariants: typeof textVariants;
  shadows: typeof shadows;
};

export type ThemeColor = keyof ThemeColors;
