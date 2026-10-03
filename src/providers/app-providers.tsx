import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { i18n } from '@/config/i18n/i18n';
import { KeyboardProvider } from '@/providers/keyboard-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';

/**
 * Single composition point for every app-wide provider. Order: outermost first.
 * GestureHandlerRootView is outermost: every GestureDetector must sit below it (it throws in
 * development otherwise), and Expo Router's native Stack does not render one.
 * KeyboardProvider (Android only; a passthrough on iOS) sits above every navigator and sheet.
 * No SafeAreaProvider here: Expo Router's ExpoRoot already renders one above the root layout.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <QueryProvider>
          <ThemeProvider>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </ThemeProvider>
        </QueryProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
