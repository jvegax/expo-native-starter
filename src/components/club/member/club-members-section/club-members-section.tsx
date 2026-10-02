import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/components/club/member/club-members-section/club-members-section.styles';
import {
  InviteMemberButton,
  type InviteMemberButtonProps,
} from '@/components/club/member/invite-member-button/invite-member-button';
import { MemberRow } from '@/components/club/member/member-row/member-row';
import { useMembersQuery } from '@/features/club/queries/member/get-members.query';
import { useStyles } from '@/shared/theme/use-styles';
import { AsyncState } from '@/shared/ui/async-state/async-state';
import { List } from '@/shared/ui/list/list';
import { Text } from '@/shared/ui/text/text';

export type ClubMembersSectionProps = Pick<InviteMemberButtonProps, 'clubId' | 'pickEmail'>;

const MEMBER_ROW_ESTIMATED_HEIGHT = 46;

/** The members of a club: owns its query, renders a virtualized list and the invite action. */
export function ClubMembersSection({ clubId, pickEmail }: ClubMembersSectionProps) {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('club');
  const members = useMembersQuery(clubId);

  return (
    <View style={styles.section}>
      <Text variant="subtitle">{t('member.title')}</Text>
      <AsyncState
        isPending={members.isPending}
        isError={members.isError}
        error={members.error}
        isEmpty={members.data?.length === 0}
        emptyMessage={t('member.empty')}
        onRetry={() => void members.refetch()}
      >
        <List
          data={members.data ?? []}
          keyExtractor={(member) => member.id}
          estimatedItemSize={MEMBER_ROW_ESTIMATED_HEIGHT}
          renderItem={({ item }) => <MemberRow member={item} />}
        />
      </AsyncState>
      <InviteMemberButton clubId={clubId} pickEmail={pickEmail} />
    </View>
  );
}
