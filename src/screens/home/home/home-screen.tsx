import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { WelcomeCard } from '@/components/home/home/welcome-card/welcome-card';
import { appConfig } from '@/config/app';
import { createStyles } from '@/screens/home/home/home-screen.styles';
import { markScreenInteractive } from '@/shared/lib/perf/startup-metrics';
import { useStyles } from '@/shared/theme/use-styles';
import { Screen } from '@/shared/ui/screen/screen';

export function HomeScreen() {
  const styles = useStyles(createStyles);

  // First screen after launch: its first commit is the app's time to interactive.
  useEffect(() => {
    markScreenInteractive('home');
  }, []);

  return (
    <Screen>
      <Stack.Screen options={{ title: appConfig.name }} />
      <View style={styles.content}>
        <WelcomeCard onBrowseClubs={() => router.push('/clubs')} />
      </View>
    </Screen>
  );
}
