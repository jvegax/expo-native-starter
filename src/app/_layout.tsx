import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { bootstrap } from '@/config/bootstrap';
import { AppProviders } from '@/providers/app-providers';

// Module scope: runs once before any route renders (http config, i18n, SDKs).
bootstrap();

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="auto" />
      {/* freezeOnBlur: on Fabric, screens two or more levels below the top stop re-rendering; the one
          right below stays live so the back gesture and its animations work. */}
      <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal', freezeOnBlur: true }} />
    </AppProviders>
  );
}
