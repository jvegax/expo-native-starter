import { useHeaderHeight } from 'expo-router/react-navigation';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { createStyles } from '@/screens/auth/session/auth-screens.styles';
import { useStyles } from '@/shared/theme/use-styles';

const isAndroid = Platform.OS === 'android';

/**
 * Scroll container for the auth forms. iOS: the large title collapses on scroll
 * (contentInsetAdjustmentBehavior) and the ScrollView insets itself above the keyboard.
 * Android (edge-to-edge, so the window no longer resizes): KeyboardAvoidingView pads instead.
 */
export function AuthFormScroll({ children }: { children: ReactNode }) {
  const styles = useStyles(createStyles);
  // KeyboardAvoidingView measures from the top of the window; the native header sits above it.
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={styles.scroll}
      behavior={isAndroid ? 'padding' : undefined}
      keyboardVerticalOffset={isAndroid ? headerHeight : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
