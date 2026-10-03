import { View } from 'react-native';

import { createStyles } from '@/components/account/user/user-summary/user-summary.styles';
import { selectUser, useSessionStore } from '@/features/auth/store/session/session.store';
import { useStyles } from '@/shared/theme/use-styles';
import { Text } from '@/shared/ui/text/text';

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Avatar (initials), name and email of the signed-in user. */
export function UserSummary() {
  const styles = useStyles(createStyles);
  const user = useSessionStore(selectUser);

  if (!user) return null;

  return (
    <View style={styles.root}>
      <View style={styles.avatar}>
        <Text variant="subtitle" color="onPrimary">
          {initialsOf(user.name)}
        </Text>
      </View>
      <View style={styles.texts}>
        <Text variant="subtitle" numberOfLines={1}>
          {user.name}
        </Text>
        <Text color="textMuted" numberOfLines={1}>
          {user.email}
        </Text>
      </View>
    </View>
  );
}
