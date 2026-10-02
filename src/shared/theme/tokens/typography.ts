import type { TextStyle } from 'react-native';

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

/** Named text styles used by the <Text variant> component. */
export const textVariants = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: fontWeights.bold },
  subtitle: { fontSize: 20, lineHeight: 26, fontWeight: fontWeights.semibold },
  body: { fontSize: 16, lineHeight: 22, fontWeight: fontWeights.regular },
  label: { fontSize: 14, lineHeight: 20, fontWeight: fontWeights.medium },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: fontWeights.regular },
} as const satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
