import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/components/club/member/member-row/member-row.styles';
import type { Member } from '@/features/club/types/member/member.types';
import { useStyles } from '@/shared/theme/use-styles';
import { Text } from '@/shared/ui/text/text';

export type MemberRowProps = {
  member: Member;
};

export function MemberRow({ member }: MemberRowProps) {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('club');

  return (
    <View style={styles.row}>
      <Text>{member.displayName}</Text>
      <Text variant="caption" color="textMuted">
        {t(`member.role.${member.role}`)}
      </Text>
    </View>
  );
}
