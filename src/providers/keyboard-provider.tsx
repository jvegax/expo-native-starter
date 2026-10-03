import type { ReactNode } from 'react';

/**
 * iOS: no keyboard provider. Its provider swaps the delegate of every focused UITextField, which
 * puts the library on the typing path (open issues with chained focus and autoCapitalize), and
 * the native ScrollView already insets for the keyboard and follows the caret (FormScrollScreen).
 * Android mounts react-native-keyboard-controller in keyboard-provider.android.tsx.
 */
export function KeyboardProvider({ children }: { children: ReactNode }) {
  return children;
}
