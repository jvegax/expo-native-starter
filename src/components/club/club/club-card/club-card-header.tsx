import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/components/club/club/club-card/club-card.styles';
import type { Club } from '@/features/club/types/club/club.types';
import { useStyles } from '@/shared/theme/use-styles';
import { Text } from '@/shared/ui/text/text';

export type ClubCardHeaderProps = Pick<Club, 'name' | 'membersCount'>;

export function ClubCardHeader({ name, membersCount }: ClubCardHeaderProps) {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('club');

  return (
    <View style={styles.header}>
      <Text variant="subtitle" numberOfLines={1} style={styles.name}>
        {name}
      </Text>
      <Text variant="caption" color="textMuted">
        {t('club.membersCount', { count: membersCount })}
      </Text>
    </View>
  );
}
