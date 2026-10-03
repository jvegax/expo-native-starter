import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import type { FormScrollScreenProps } from '@/shared/ui/form-scroll-screen/form-scroll-screen';
import { createStyles } from '@/shared/ui/form-scroll-screen/form-scroll-screen.styles';

const EDGES = ['bottom'] as const;

/**
 * Android FormScrollScreen (iOS: form-scroll-screen.tsx). Edge-to-edge stops the window from
 * resizing for the keyboard, so KeyboardAwareScrollView (react-native-keyboard-controller, mounted
 * by KeyboardProvider) grows the scrollable area frame by frame with the IME and keeps the focused
 * caret `bottomOffset` above it. A bottom SafeAreaView keeps the end of the content above the
 * navigation bar while the keyboard is closed (like ScrollScreen).
 */
export function FormScrollScreen({ children, padded = true }: FormScrollScreenProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();

  return (
    <SafeAreaView edges={EDGES} style={styles.root}>
      <KeyboardAwareScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, padded && styles.padded]}
        bottomOffset={theme.spacing.lg}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
