import type { ReactNode } from 'react';
import { Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles } from '@/shared/theme/use-styles';
import { createStyles } from '@/shared/ui/scroll-screen/scroll-screen.styles';

export type ScrollScreenProps = {
  children: ReactNode;
  /** Adds horizontal padding. */
  padded?: boolean;
};

const ANDROID_EDGES = ['bottom'] as const;

/**
 * Scrollable screen body for static content inside native headers and tabs.
 * - iOS: the ScrollView is the screen's first native child, so the large title collapses, the tab
 *   bar minimizes (iOS 26) and content insets under the header and above the tab bar by itself.
 * - Android (edge-to-edge): a bottom SafeAreaView keeps the end of the content above the navigation
 *   bar. It measures its own frame, so it adds nothing inside NativeTabs, which already insets.
 * Data lists use <List>; non-scrolling content uses <Screen>.
 */
export function ScrollScreen({ children, padded = true }: ScrollScreenProps) {
  const styles = useStyles(createStyles);

  const scroll = (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, padded && styles.padded]}
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  );

  if (Platform.OS !== 'android') return scroll;
  return (
    <SafeAreaView edges={ANDROID_EDGES} style={styles.root}>
      {scroll}
    </SafeAreaView>
  );
}
