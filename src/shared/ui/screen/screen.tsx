import type { ReactNode } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useStyles } from '@/shared/theme/use-styles';
import { createStyles } from '@/shared/ui/screen/screen.styles';

export type ScreenProps = {
  children: ReactNode;
  /** Adds horizontal padding. Disable for full-bleed lists that handle their own padding. */
  padded?: boolean;
  edges?: Edge[];
};

const DEFAULT_EDGES: Edge[] = ['bottom', 'left', 'right'];

export function Screen({ children, padded = true, edges = DEFAULT_EDGES }: ScreenProps) {
  const styles = useStyles(createStyles);

  return (
    <SafeAreaView edges={edges} style={[styles.root, padded && styles.padded]}>
      {children}
    </SafeAreaView>
  );
}
