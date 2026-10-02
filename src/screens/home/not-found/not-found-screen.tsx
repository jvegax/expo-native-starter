import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/screens/home/not-found/not-found-screen.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Screen } from '@/shared/ui/screen/screen';
import { Text } from '@/shared/ui/text/text';

// Rendered by Expo Router for any unmatched URL (deep links included).
export function NotFoundScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('home');

  return (
    <Screen>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.content}>
        <Text color="textMuted" align="center">
          {t('notFound.message')}
        </Text>
        {/* replace, not push: the unmatched URL should not stay in the back history. */}
        <Button label={t('notFound.goHome')} variant="ghost" onPress={() => router.replace('/')} />
      </View>
    </Screen>
  );
}
