import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/shared/ui/icon/icon';
import type { IconProps } from '@/shared/ui/icon/icon';
import { ListRow } from '@/shared/ui/list-row/list-row';
import { ListSection } from '@/shared/ui/list-section/list-section';
import { ScrollScreen } from '@/shared/ui/scroll-screen/scroll-screen';

type SettingsEntry = {
  id: 'account' | 'notifications' | 'privacy' | 'about';
  icon: Pick<IconProps, 'ios' | 'android'>;
};

// Mocked entries: each one opens the same data-less detail screen.
const ENTRIES: SettingsEntry[] = [
  { id: 'account', icon: { ios: 'person.crop.circle', android: 'account_circle' } },
  { id: 'notifications', icon: { ios: 'bell', android: 'notifications' } },
  { id: 'privacy', icon: { ios: 'hand.raised', android: 'privacy_tip' } },
  { id: 'about', icon: { ios: 'info.circle', android: 'info' } },
];

export function SettingsScreen() {
  const { t } = useTranslation('account');

  return (
    <ScrollScreen>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ListSection>
        {ENTRIES.map((entry) => (
          <ListRow
            key={entry.id}
            title={t(`settings.${entry.id}`)}
            icon={<Icon {...entry.icon} />}
            onPress={() => router.push({ pathname: '/details/[id]', params: { id: entry.id } })}
          />
        ))}
      </ListSection>
    </ScrollScreen>
  );
}
