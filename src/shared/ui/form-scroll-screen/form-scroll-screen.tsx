import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { useStyles } from '@/shared/theme/use-styles';
import { createStyles } from '@/shared/ui/form-scroll-screen/form-scroll-screen.styles';

export type FormScrollScreenProps = {
  children: ReactNode;
  /** Adds horizontal padding. */
  padded?: boolean;
};

/**
 * Scrollable screen body for any screen with text inputs (iOS; Android is the .android.tsx file).
 * The ScrollView is the screen's first native child, so the large title collapses and the tab bar
 * insets (contentInsetAdjustmentBehavior). automaticallyAdjustKeyboardInsets insets it above the
 * keyboard on the keyboard's own animation and scrolls the caret of the focused input into view.
 * Never wrap it in a View or KeyboardAvoidingView (forms-keyboard skill).
 */
export function FormScrollScreen({ children, padded = true }: FormScrollScreenProps) {
  const styles = useStyles(createStyles);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, padded && styles.padded]}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
