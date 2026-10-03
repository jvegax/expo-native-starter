/** Primitive palette. Components never use these directly; they use semantic theme colors. */
export const palette = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  blue100: '#DBEAFE',
  blue400: '#60A5FA',
  blue600: '#2563EB',
  blue700: '#1D4ED8',
  blue900: '#1E3A8A',
  red500: '#EF4444',
  green500: '#22C55E',
  // Translucent overlays (Android ripple). Material's default highlight is 12% black / 20% white.
  blackAlpha12: 'rgba(0, 0, 0, 0.12)',
  whiteAlpha20: 'rgba(255, 255, 255, 0.2)',
} as const;
