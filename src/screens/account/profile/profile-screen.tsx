import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { UserSummary } from '@/components/account/user/user-summary/user-summary';
import { useConfirmSignOut } from '@/features/auth/hooks/session/use-confirm-sign-out';
import { Button } from '@/shared/ui/button/button';
import { Icon } from '@/shared/ui/icon/icon';
import { ListRow } from '@/shared/ui/list-row/list-row';
import { ListSection } from '@/shared/ui/list-section/list-section';
import { ScrollScreen } from '@/shared/ui/scroll-screen/scroll-screen';

export function ProfileScreen() {
  const { t } = useTranslation(['account', 'auth']);
  const confirmSignOut = useConfirmSignOut();

  return (
    <ScrollScreen>
      <Stack.Screen options={{ title: t('profile.title') }} />
      <UserSummary />
      <ListSection>
        <ListRow
          title={t('profile.openDetail')}
          subtitle={t('profile.openDetailHint')}
          icon={<Icon ios="arrow.up.right.square" android="open_in_new" />}
          onPress={() => router.push({ pathname: '/details/[id]', params: { id: 'profile' } })}
        />
        <ListRow
          title={t('profile.openSheet')}
          subtitle={t('profile.openSheetHint')}
          icon={<Icon ios="rectangle.bottomhalf.inset.filled" android="bottom_sheets" />}
          onPress={() => router.push('/sheet')}
        />
      </ListSection>
      <Button label={t('auth:signOut.label')} variant="secondary" onPress={confirmSignOut} />
    </ScrollScreen>
  );
}
