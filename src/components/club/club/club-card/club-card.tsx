import { Platform, Pressable } from 'react-native';

import { ClubCardHeader } from '@/components/club/club/club-card/club-card-header';
import { createStyles } from '@/components/club/club/club-card/club-card.styles';
import type { Club } from '@/features/club/types/club/club.types';
import { useStyles } from '@/shared/theme/use-styles';
import { useTheme } from '@/shared/theme/use-theme';
import { Text } from '@/shared/ui/text/text';

export type ClubCardProps = {
  club: Club;
  onPress?: (club: Club) => void;
  /** Fires on touch down, before onPress: the moment to prefetch what the next screen needs. */
  onPressIn?: (club: Club) => void;
};

const isAndroid = Platform.OS === 'android';

export function ClubCard({ club, onPress, onPressIn }: ClubCardProps) {
  const styles = useStyles(createStyles);
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress ? () => onPress(club) : undefined}
      onPressIn={onPressIn ? () => onPressIn(club) : undefined}
      // Android: native ripple and a static style (no re-render on press). iOS: pressed style.
      android_ripple={onPress ? { color: theme.colors.ripple, foreground: true } : undefined}
      style={isAndroid || !onPress ? styles.card : ({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ClubCardHeader name={club.name} membersCount={club.membersCount} />
      {club.description ? (
        <Text color="textMuted" numberOfLines={2}>
          {club.description}
        </Text>
      ) : null}
    </Pressable>
  );
}
