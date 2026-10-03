import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { selectIsSignedIn, useSessionStore } from '@/features/auth/store/session/session.store';
import { createStyles } from '@/screens/home/not-found/not-found-screen.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Screen } from '@/shared/ui/screen/screen';
import { Text } from '@/shared/ui/text/text';

// Rendered by Expo Router for any unmatched URL (deep links included).
export function NotFoundScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('home');
  const isSignedIn = useSessionStore(selectIsSignedIn);

  // Back when there is history (no second copy of the app underneath). On a cold-start deep link
  // +not-found is the only route: replace with a route the auth gate allows right now, because a
  // protected group is not registered and a replace into it would be silently ignored.
  const leave = () => (router.canGoBack() ? router.back() : router.replace(isSignedIn ? '/' : '/sign-in'));

  return (
    <Screen>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.content}>
        <Text color="textMuted" align="center">
          {t('notFound.message')}
        </Text>
        <Button label={t('notFound.goHome')} variant="ghost" onPress={leave} />
      </View>
    </Screen>
  );
}
