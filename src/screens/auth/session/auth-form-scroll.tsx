import { useHeaderHeight } from 'expo-router/react-navigation';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { createStyles } from '@/screens/auth/session/auth-screens.styles';
import { useStyles } from '@/shared/theme/use-styles';

/**
 * Scroll container for the auth forms. iOS: the ScrollView is the screen's first native child, so
 * the large title collapses (contentInsetAdjustmentBehavior) and it insets itself above the keyboard
 * and scrolls the caret into view (automaticallyAdjustKeyboardInsets).
 * Android (edge-to-edge, so the window no longer resizes): KeyboardAvoidingView pads instead.
 */
export function AuthFormScroll({ children }: { children: ReactNode }) {
  const styles = useStyles(createStyles);

  const scroll = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      automaticallyAdjustKeyboardInsets
    >
      {children}
    </ScrollView>
  );

  if (Platform.OS !== 'android') return scroll;
  return <AndroidKeyboardAvoiding>{scroll}</AndroidKeyboardAvoiding>;
}

function AndroidKeyboardAvoiding({ children }: { children: ReactNode }) {
  const styles = useStyles(createStyles);
  // KeyboardAvoidingView measures from the top of the window; the native header sits above it.
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView style={styles.scroll} behavior="padding" keyboardVerticalOffset={headerHeight}>
      {children}
    </KeyboardAvoidingView>
  );
}
