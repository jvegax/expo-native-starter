import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ClubCard } from '@/components/club/club/club-card/club-card';
import { ClubMembersSection } from '@/components/club/member/club-members-section/club-members-section';
import { useClubQuery } from '@/features/club/queries/club/get-club.query';
import type { Id } from '@/shared/types/common.types';
import { AsyncState } from '@/shared/ui/async-state/async-state';
import { Screen } from '@/shared/ui/screen/screen';

export type ClubDetailScreenProps = {
  clubId: Id;
};

// Replace with a form/modal in a real app; the template only shows the mutation wiring.
const pickEmail = async () => null;

export function ClubDetailScreen({ clubId }: ClubDetailScreenProps) {
  const { t } = useTranslation('club');
  const club = useClubQuery(clubId);

  return (
    <Screen>
      <Stack.Screen options={{ title: club.data?.name ?? t('club.detailTitle') }} />
      <AsyncState isPending={club.isPending} isError={club.isError} error={club.error} onRetry={() => void club.refetch()}>
        {club.data ? <ClubCard club={club.data} /> : null}
        <ClubMembersSection clubId={clubId} pickEmail={pickEmail} />
      </AsyncState>
    </Screen>
  );
}
