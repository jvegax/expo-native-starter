import type { ViewStyle } from 'react-native';

export const shadows = {
  sm: { boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)' },
  md: { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)' },
} as const satisfies Record<string, ViewStyle>;
