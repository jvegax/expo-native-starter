import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { WelcomeCard } from '@/components/home/home/welcome-card/welcome-card';
import { appConfig } from '@/config/app';
import { markScreenInteractive } from '@/shared/lib/perf/startup-metrics';
import { Icon } from '@/shared/ui/icon/icon';
import { ListRow } from '@/shared/ui/list-row/list-row';
import { ListSection } from '@/shared/ui/list-section/list-section';
import { ScrollScreen } from '@/shared/ui/scroll-screen/scroll-screen';

// Mocked entries: they only demonstrate navigation to a detail screen that has no data.
const MOCK_ITEM_IDS = ['1', '2', '3', '4', '5'];

function openItem(id: string) {
  router.push({ pathname: '/details/[id]', params: { id } });
}

export function HomeScreen() {
  const { t } = useTranslation('home');

  // First screen after a signed-in launch: its first commit is the app's time to interactive.
  useEffect(() => {
    markScreenInteractive('home');
  }, []);

  return (
    <ScrollScreen>
      <Stack.Screen options={{ title: appConfig.name }} />
      {/* /clubs is the Clubs tab: pushing it switches tabs. */}
      <WelcomeCard onBrowseClubs={() => router.push('/clubs')} />
      <ListSection title={t('items.title')}>
        {MOCK_ITEM_IDS.map((id) => (
          <ListRow
            key={id}
            title={t('items.rowTitle', { id })}
            subtitle={t('items.rowSubtitle')}
            icon={<Icon ios="doc.text" android="description" />}
            onPress={() => openItem(id)}
          />
        ))}
      </ListSection>
    </ScrollScreen>
  );
}
