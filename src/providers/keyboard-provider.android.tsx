import type { ReactNode } from 'react';
import { KeyboardProvider as KeyboardControllerProvider } from 'react-native-keyboard-controller';

/**
 * Android: react-native-keyboard-controller follows the IME frame by frame. Edge-to-edge (forced
 * since SDK 54) stops the window from resizing for the keyboard, so RN's KeyboardAvoidingView only
 * jumps after the animation. No translucency props: edge-to-edge forces them.
 * preload={false}: the cold-start screen (sign-in) does not autofocus, and preloading can flash the
 * keyboard on launch (keyboard-controller #1077).
 * iOS uses keyboard-provider.tsx (no provider): see the forms-keyboard skill.
 */
export function KeyboardProvider({ children }: { children: ReactNode }) {
  return <KeyboardControllerProvider preload={false}>{children}</KeyboardControllerProvider>;
}
