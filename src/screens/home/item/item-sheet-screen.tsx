import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { createStyles } from '@/screens/home/item/item-screens.styles';
import { useStyles } from '@/shared/theme/use-styles';
import { Button } from '@/shared/ui/button/button';
import { Text } from '@/shared/ui/text/text';

/** Native form sheet (presentation and detents are set in AppStackLayout). */
export function ItemSheetScreen() {
  const styles = useStyles(createStyles);
  const { t } = useTranslation('home');

  return (
    <View style={styles.sheet}>
      <Text variant="subtitle">{t('item.sheetTitle')}</Text>
      <Text color="textMuted">{t('item.sheetBody')}</Text>
      <Button label={t('item.close')} variant="secondary" onPress={() => router.back()} />
    </View>
  );
}
