import { StatusBar } from 'expo-status-bar';

import { bootstrap } from '@/config/bootstrap';
import { AppProviders } from '@/providers/app-providers';
import { RootNavigator } from '@/screens/navigation/root/root-navigator';

// Module scope: runs once before any route renders (http config, i18n, auth, SDKs).
bootstrap();

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      {/* Root Stack with the auth gate (Stack.Protected): (app) when signed in, (auth) otherwise. */}
      <RootNavigator />
    </AppProviders>
  );
}
