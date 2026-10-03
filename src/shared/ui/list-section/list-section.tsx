import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useStyles } from '@/shared/theme/use-styles';
import { createStyles } from '@/shared/ui/list-section/list-section.styles';
import { Text } from '@/shared/ui/text/text';

export type ListSectionProps = {
  title?: string;
  /** <ListRow> elements; hairline separators are drawn between them. */
  children: ReactNode;
};

/** Rounded group of rows (inset grouped list) for short, static menus. Long or dynamic lists use <List>. */
export function ListSection({ title, children }: ListSectionProps) {
  const styles = useStyles(createStyles);

  return (
    <View style={styles.root}>
      {title ? (
        <Text variant="caption" color="textMuted" style={styles.title}>
          {title.toUpperCase()}
        </Text>
      ) : null}
      <View style={styles.group}>{children}</View>
    </View>
  );
}
