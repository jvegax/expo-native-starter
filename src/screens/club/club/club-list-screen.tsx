import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ClubCard } from '@/components/club/club/club-card/club-card';
import { useClubsQuery } from '@/features/club/queries/club/get-clubs.query';
import { usePrefetchClubMembers } from '@/features/club/queries/member/prefetch-club-members.query';
import type { Club } from '@/features/club/types/club/club.types';
import { createStyles } from '@/screens/club/club/club-screens.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { AsyncState } from '@/shared/ui/async-state/async-state';
import { List } from '@/shared/ui/list/list';
import { Screen } from '@/shared/ui/screen/screen';

const CLUB_CARD_ESTIMATED_HEIGHT = 96;

function openClub(club: Club) {
  router.push({ pathname: '/clubs/[clubId]', params: { clubId: club.id } });
}

export function ClubListScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('club');
  const clubs = useClubsQuery();
  const prefetchMembers = usePrefetchClubMembers();
  // Only a pull shows the spinner; background refetches (focus, reconnect) stay silent.
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsPullRefreshing(true);
    void clubs.refetch().finally(() => setIsPullRefreshing(false));
  };

  return (
    <Screen>
      {/* Large title (iOS) collapses when the List scrolls (it defaults to contentInsetAdjustmentBehavior="automatic"). */}
      <Stack.Screen
        options={{ title: t('club.listTitle'), headerLargeTitleEnabled: true, headerLargeTitleShadowVisible: false }}
      />
      <AsyncState
        isPending={clubs.isPending}
        isError={clubs.isError}
        error={clubs.error}
        isEmpty={clubs.data?.items.length === 0}
        emptyMessage={t('club.empty')}
        onRetry={() => void clubs.refetch()}
      >
        <List
          data={clubs.data?.items ?? []}
          keyExtractor={(club) => club.id}
          estimatedItemSize={CLUB_CARD_ESTIMATED_HEIGHT}
          renderItem={({ item }) => (
            <ClubCard club={item} onPress={openClub} onPressIn={(club) => prefetchMembers(club.id)} />
          )}
          contentContainerStyle={styles.list}
          refreshing={isPullRefreshing}
          onRefresh={handleRefresh}
        />
      </AsyncState>
    </Screen>
  );
}
